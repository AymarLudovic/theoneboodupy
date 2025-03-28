import { Heart, MessageCircle,  } from "lucide-react"
import Icon2 from "../SocialIconprofile/Icon2"

const ActionButton1 = () => {
  return (
    <div className="flex flex-col gap-2">
        <div className="flex gap-3 items-center">
        <div className="p-1 flex items-center gap-1 justify-center">
            <Heart size={20}></Heart>
            <span className="font-semibold text-sm">990 likes</span>
        </div>
        <div className="p-1 flex items-center gap-1 justify-center">
            <MessageCircle size={20}></MessageCircle>
            <span className="font-semibold text-sm">990 likes</span>
        </div>
    </div>
    <div className="flex items-center gap-2 pb-2 border-b border-[#fafafa]">
    <div className="flex   -mt-4">
        <Icon2></Icon2>
        
    </div>
    <div>
    <div className="-mr-4 relative">
            <p className="font-semibold text-xs">challah_cat</p>
            <p className="text-xs">This videos is awesome disney never been disappoint to how bad they are But they </p>
        </div>
    </div>
    </div>
    </div>
  )
}

export default ActionButton1