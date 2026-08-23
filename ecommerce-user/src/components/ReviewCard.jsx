import { AvatarCustom, AvatarFallback, UserIcon } from "./CustomTag";
import Rating from '@mui/material/Rating';
import "./ReviewCard.css";

const ReviewCard = ({reviewPoint, reviewTitle, reviewContent, reviewer, regDttm}) => {
    return (
        <div className="border-line">
            <div>
                <Rating name="half-rating" defaultValue={reviewPoint} precision={0.5} readOnly/>
                <h2>{reviewTitle}</h2>
                <h4>{reviewContent}</h4>
            </div>
            
            <div className="profile-sector">
                <AvatarCustom className="profile-avatar h-5 w-5">
                    <AvatarFallback className="avatar-fallback">
                        <UserIcon className="avatar-icon" />
                    </AvatarFallback>
                </AvatarCustom>
                <div className="profile-text-info">
                    <span className="profile-name">{reviewer}</span>
                    <span className="profile-name">{regDttm}</span>
                </div>
            </div>
        </div>
    )
}

export default ReviewCard