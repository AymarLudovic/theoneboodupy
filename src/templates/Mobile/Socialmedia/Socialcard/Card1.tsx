import ActionButton1 from "../ActionButtons/ActionButton1"
import Icon1 from "../SocialIconprofile/Icon1"
import Content1 from "../Socialcontent/Content1"


const Card1 = () => {
  return (
    <div className="flex flex-col w-full gap-2">
        <Icon1></Icon1>
        <Content1></Content1>
        <ActionButton1></ActionButton1>
    </div>
  )
}

export default Card1