import Navigation from "../components/Navigation"
import Product from "../components/Product";
import SideNavigation from "../components/SideNavigation"
import "./ProductListPage.css"
import { useParams } from "react-router-dom";
import api from "../api/axios.js";
import { useEffect, useState } from "react";

const ProductListPage = () => {
    const { id } = useParams(); 
    const [productData, setProductData] = useState(null);
    const [sideMenu, setSideMenu] = useState([]);
    

    let navigationMenu = [
        {
            title: "Hot",
            link: "/product/info",
        },
        {
            title: "세일",
            link: "/product/order",
        },
        {
            title: "라이브",
            link: "/product/inquiry",
        },
        {
            title: "이벤트",
            link: "/product/inquiry",
        },
        {
            title: "회원혜택",
            link: "/product/inquiry",
        }
    ];

    const findCategoryPath = (categories, targetId, currentPath = []) => {
        for (const cat of categories) {
            const newPath = [...currentPath, cat];
            
            if (cat.categoryId === Number(targetId)) return newPath;
            
            if (cat.childCategory && cat.childCategory.length > 0) {
                const foundPath = findCategoryPath(cat.childCategory, targetId, newPath);
                if (foundPath) return foundPath;
            }
        }
        return null;
    };

    const transformToSideMenu = (categoryList) => {
        if (!categoryList || !Array.isArray(categoryList)) return [];
        
        return categoryList.map(item => {
            const hasChildren = item.childCategory && item.childCategory.length > 0;
            return {
                title: item.categoryName,
                link: `/product-list/${item.categoryId}`,
                subMenu: hasChildren ? transformToSideMenu(item.childCategory) : null
            };
        });
    };

    useEffect(() => {
        const fetchPageData = async () => {
            try {
                const prodResponse = await api.get(`/product/list?categoryId=${id}`);
                prodResponse.data.products = prodResponse.data.products.map(product => ({
                    ...product,
                    imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100&h=100&fit=crop&crop=center",
                }));
                setProductData(prodResponse.data);

                const catResponse = await api.get(`/category/list`);
                const allCategories = catResponse.data;

                const path = findCategoryPath(allCategories, id);
                
                if (path) {
                    const baseNode = path.length >= 3 ? path[2] : path[path.length - 1];

                    if (baseNode && baseNode.childCategory && baseNode.childCategory.length > 0) {
                        const dynamicSideMenu = transformToSideMenu(baseNode.childCategory);
                        setSideMenu([
                            { title: "전체", link: `/product-list/${baseNode.categoryId}` },
                            ...dynamicSideMenu
                        ]);
                    } else {
                        setSideMenu([]); 
                    }
                } else {
                    setSideMenu([]);
                }

            } catch (error) {
                console.error("데이터를 불러오는 데 실패했습니다:", error);
            }
        };

        fetchPageData();
    }, [id]);

    if (!productData) {
        return <div className="ebear-container">로딩 중...</div>;
    }

    return (
        <div className="ebear-container">
            <Navigation navigationMenu={navigationMenu} />

            <div className="page-title">
                <h1>{productData.category}</h1>
            </div>

            <div className="main-layout">
                <SideNavigation sideMenu={sideMenu} type={false} />

                <main className="main-content">
                    <div className="product-select">
                        <select>
                            <option>최신순</option>
                            <option>인기순</option>
                            <option>가격 낮은 순</option>
                            <option>가격 높은 순</option>
                        </select>
                    </div>

                    <div className="product-grid">
                        {productData.products.map(product => (
                            <Product product={product} />
                        ))}
                    </div>

                    <div className="product-more-button">
                        <button>더보기</button>
                    </div>
                </main>
            </div>
        </div>
    )

}

export default ProductListPage