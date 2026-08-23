import React, { useState, useEffect } from 'react';
import './SideMenu.css';
import { ChevronRightIcon } from '../components/CustomTag';
import { Link } from 'react-router-dom';
import api from "../api/axios.js";

function SideMenu({ onClose }) {
    const [ecommerceMenu, setEcommerceMenu] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const transformToMenuTree = (categoryList, currentDepth = 1) => {
        if (!categoryList || !Array.isArray(categoryList)) return [];
    
        return categoryList.map(item => {
            const hasChildren = item.childCategory && item.childCategory.length > 0;
            const shouldRecurse = hasChildren && currentDepth < 3;
            
            const mappedItem = {
                title: item.categoryName,
                categoryId: item.categoryId,
                categoryValue: item.categoryValue,
                subMenu: shouldRecurse ? transformToMenuTree(item.childCategory, currentDepth + 1) : []
            };
    
            if (!shouldRecurse) {
                mappedItem.link = `/product-list/${item.categoryId}`; 
            }
    
            return mappedItem;
        });
    };

    useEffect(() => {
        // DB에서 데이터를 가져오는 비동기 함수를 정의합니다.
        const fetchMenuData = async () => {
            setIsLoading(true); // 로딩 시작

            try {
                // 실제 DB/API 호출 로직을 여기에 작성
                // 예: const response = await fetch('/api/getMenu');
                // 예: const data = await response.json();
                const response = await api.get(`/category/list`);
                const data = transformToMenuTree(response.data);
                // 데이터 상태에 저장
                setEcommerceMenu(data); 
            } catch (error) {
                console.error("메뉴 데이터를 불러오는 데 실패했습니다:", error);
                // 에러 처리 (예: 빈 메뉴 표시, 에러 메시지 표시)
                setEcommerceMenu([]);
            } finally {
                setIsLoading(false); // 로딩 끝
            }
        };

        fetchMenuData();
    }, []); //두 번째 인자에 빈 배열([])을 넣으면 컴포넌트 로드 시 한 번만 실행

    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [hoverTimeout, setHoverTimeout] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleMouseEnter = (index) => {
        if (hoverTimeout) {
            clearTimeout(hoverTimeout);
            setHoverTimeout(null);
        }
        setHoveredIndex(index);
    };

    const handleMenuClick = (index) => {
        if (isMobile) {
            // 모바일에서는 클릭 시 하위 메뉴 토글
            if (hoveredIndex === index) {
                setHoveredIndex(null);
            } else {
                setHoveredIndex(index);
            }
        }
    };

    const handleMouseLeave = () => {
        const timeout = setTimeout(() => {
            setHoveredIndex(null);
        }, 200);
        setHoverTimeout(timeout);
    };

    const handleSubMenuMouseEnter = () => {
        if (hoverTimeout) {
            clearTimeout(hoverTimeout);
            setHoverTimeout(null);
        }
    };

    const handleLinkClick = () => {
        if (onClose) {
            onClose();
        }
    };

    const handleWrapperClick = (e) => {
        // 모바일에서만 뒷 배경(오버레이) 클릭 시 메뉴 닫기
        if (isMobile) {
            // 클릭한 요소가 wrapper 자체이거나, 메뉴 박스 밖의 영역일 때
            const clickedElement = e.target;
            const menuBox = e.currentTarget.querySelector('.side-menu');
            
            if (!menuBox || !menuBox.contains(clickedElement)) {
                if (onClose) {
                    onClose();
                }
            }
        }
    };

    const handleMenuBoxClick = (e) => {
        // 메뉴 박스 자체를 클릭했을 때는 이벤트가 상위(wrapper)로 전파되지 않도록
        // 하위 메뉴 패널이 활성화되어 있어도 이벤트 전파를 차단 (오버레이 클릭 방지)
        e.stopPropagation();
    };

    const handleSubMenuPanelClick = (e) => {
        // 하위 메뉴 패널 내부 클릭은 wrapper로 전파되지 않도록 차단
        // 이렇게 하면 오버레이 클릭으로 인식되지 않음
        e.stopPropagation();
    };

    const renderMenuItems = (items, depth = 0) => {
        if (!Array.isArray(items) || items.length === 0) {
            return null;
        }

        return items.map((item, index) => {
            const key = `${depth}-${index}-${item.title}`;
            const hasChildren = Array.isArray(item.subMenu) && item.subMenu.length > 0;
            const titleContent = item.link ? (
                <Link
                    to={item.link}
                    className={depth === 0 ? 'sub-menu-column-title-link' : 'sub-menu-item-link'}
                    onClick={handleLinkClick}
                >
                    {depth === 0 ? (
                        <h3 className="sub-menu-column-title">{item.title}</h3>
                    ) : (
                        item.title
                    )}
                </Link>
            ) : depth === 0 ? (
                <h3 className="sub-menu-column-title">{item.title}</h3>
            ) : (
                <span className="sub-menu-nested-title-text">{item.title}</span>
            );

            if (depth === 0) { //2depth 그림
                return (
                    <div className="sub-menu-column" key={key}>
                        <div className="sub-menu-column-header">
                            {titleContent}
                            {hasChildren && <div className="sub-menu-column-divider"></div>}
                        </div>
                        <div className="sub-menu-column-list">
                            {hasChildren ? ( //하위 메뉴가 있는 경우
                                renderMenuItems(item.subMenu, depth + 1)
                            ) : (
                                item.link && ( //하위 메뉴가 없으면
                                    <Link
                                        to={item.link}
                                        className="sub-menu-item-link"
                                        onClick={handleLinkClick}
                                    >
                                        {item.title}
                                    </Link>
                                )
                            )}
                        </div>
                    </div>
                );
            }

            if (hasChildren) { //3depth 그림
                return (
                    <div className="sub-menu-nested" key={key}>
                        <div className="sub-menu-nested-title">
                            {titleContent}
                        </div>
                        <div className="sub-menu-nested-list">
                            {renderMenuItems(item.subMenu, depth + 1)}
                        </div>
                    </div>
                );
            }

            return ( //더이상 하위 메뉴가 없으면
                <Link
                    key={key}
                    to={item.link || '#'}
                    className="sub-menu-item-link"
                    onClick={handleLinkClick}
                >
                    {item.title}
                </Link>
            );
        });
    };

    if (isLoading) {
        return (
            <div className="side-menu-wrapper">
                <aside className="side-menu">
                    <div className="side-menu-container loading-state">
                        <p>메뉴 데이터를 불러오는 중...</p>
                    </div>
                </aside>
            </div>
        );
    }

    return (
        <div className="side-menu-wrapper" onClick={handleWrapperClick}>
            <aside className="side-menu" onClick={handleMenuBoxClick}>
                <div 
                    className="side-menu-container"
                    onMouseLeave={handleMouseLeave}
                >
                    {/* 왼쪽 사이드바 - 1depth */}
                    <nav className="side-menu-nav">
                        {ecommerceMenu.map((firstItem, firstIndex) => (
                            <div 
                                className="menu-item-container" 
                                key={firstIndex}
                                onMouseEnter={() => !isMobile && handleMouseEnter(firstIndex)}
                                onClick={(e) => {
                                    // 모바일에서만 1depth 메뉴 클릭 처리
                                    // 하위 메뉴 패널이 활성화되어 있으면 이벤트 전파 차단
                                    if (isMobile) {
                                        e.stopPropagation();
                                        handleMenuClick(firstIndex);
                                    }
                                }}
                            >
                                <div className={`menu-item ${hoveredIndex === firstIndex ? 'active' : ''}`}>
                                    <div className="menu-row first-level">
                                        <span className="menu-title">{firstItem.title}</span>
                                        {firstItem.subMenu && (
                                            <ChevronRightIcon className="menu-icon" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </nav>

                    {/* 오른쪽 흰색 패널 - 2depth, 3depth 멀티 컬럼 */}
                    {hoveredIndex !== null && ecommerceMenu[hoveredIndex].subMenu && (
                        <div 
                            className={`sub-menu-content-panel ${isMobile ? 'active-panel' : ''}`}
                            onMouseEnter={handleSubMenuMouseEnter}
                            onClick={handleSubMenuPanelClick}
                        >
                            {isMobile && (
                                <div className="sub-menu-back-button" onClick={(e) => {
                                    e.stopPropagation();
                                    setHoveredIndex(null);
                                }}>
                                    <ChevronRightIcon className="back-icon" style={{ transform: 'rotate(180deg)' }} />
                                    <span>뒤로</span>
                                </div>
                            )}
                            <div className="sub-menu-columns-wrapper">
                                {renderMenuItems(ecommerceMenu[hoveredIndex].subMenu)}
                            </div>
                            <div className="sub-menu-footer">
                                <a href="#" className="footer-link">바로가기 &gt;</a>
                                <a href="#" className="footer-link">해외직구</a>
                            </div>
                        </div>
                    )}
                </div>
            </aside>
        </div>
    );
}

export default SideMenu;

