import { Plus } from "lucide-react"

const OnboardPage = () => {
  return (
    <>
        <nav className="w-full top-0 sticky p-2 py-8 px-10 flex items-center justify-between">
            <a href="">
                <img src="public/logo.svg" height={20} width={50} alt="" />
            </a>
            <div className="flex border gap-1 border-[#EEE] select-none items-center justify-between w-auto rounded-[14px]">
                <div className="p-1 cursor-pointer bg-[#EEE]  rounded-[14px]">
                    Website
                </div>
                <div className="p-1  rounded-[14px] cursor-pointer">
                    Mobile apps
                </div>
            </div>
            <div>
                <a href="/builder" className="flex items-center gap-1 py-2 px-3 rounded-full border bg-[#fafafa] border-[#EEE] font-semibold">
                    <Plus size={18}></Plus>
                    Create app
                </a>
            </div>
        </nav>
        <section className="w-full h-auto flex justify-center items-center gap-4 flex-wrap">
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-center w-[380px] rounded-[15px] bg-[#FAFAFA] h-[300px]"></div>
                <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-[50px] rounded-[15px] bg-[#FAFAFA] h-[50px]"></div>
                <h2 className="text-1xl font-semibold text-[#0A0A0A]">Notion Clone</h2>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-center w-[380px] rounded-[15px] bg-[#FAFAFA] h-[300px]"></div>
                <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-[50px] rounded-[15px] bg-[#FAFAFA] h-[50px]"></div>
                <h2 className="text-1xl font-semibold text-[#0A0A0A]">Notion Clone</h2>
                </div>
            </div>
             <div className="flex flex-col gap-2">
                <div className="flex items-center justify-center w-[380px] rounded-[15px] bg-[#FAFAFA] h-[300px]"></div>
                <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-[50px] rounded-[15px] bg-[#FAFAFA] h-[50px]"></div>
                <h2 className="text-1xl font-semibold text-[#0A0A0A]">Notion Clone</h2>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-center w-[380px] rounded-[15px] bg-[#FAFAFA] h-[300px]"></div>
                <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-[50px] rounded-[15px] bg-[#FAFAFA] h-[50px]"></div>
                <h2 className="text-1xl font-semibold text-[#0A0A0A]">Notion Clone</h2>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-center w-[380px] rounded-[15px] bg-[#FAFAFA] h-[300px]"></div>
                <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-[50px] rounded-[15px] bg-[#FAFAFA] h-[50px]"></div>
                <h2 className="text-1xl font-semibold text-[#0A0A0A]">Notion Clone</h2>
                </div>
            </div>
             <div className="flex flex-col gap-2">
                <div className="flex items-center justify-center w-[380px] rounded-[15px] bg-[#FAFAFA] h-[300px]"></div>
                <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-[50px] rounded-[15px] bg-[#FAFAFA] h-[50px]"></div>
                <h2 className="text-1xl font-semibold text-[#0A0A0A]">Notion Clone</h2>
                </div>
            </div>
        </section>
    </>
  )
}

export default OnboardPage