

const Footer1 = () => {
  return (
    <footer className="w-full h-full mt-12 p-10 flex items-center justify-between border-t border-[#FAFAFA]">
        <div className="flex flex-col gap-3">
            <h1 className="text-2xl font-semibold text-[#E4E4E4]">
               FU. Fluctus
            </h1>
            <div className="flex flex-col gap-1">
            <p className="font-semibold text-[#E4E4E4]">Empowering organisations to harness <br /> The full potentiel of artificial inteligence</p>
            </div>
        </div>
        <div className="flex items-center gap-10">
        <div className="flex flex-col gap-3">
            <h1 className="text-1xl font-semibold text-[#E4E4E4]">
               Menu
            </h1>
            <div className="flex flex-col gap-1">
            <a href=""  className="font-semibold text-[#E4E4E4]">Contact</a>
            <a href=""  className="font-semibold text-[#E4E4E4]">FAQ</a>
            <a href=""  className="font-semibold text-[#E4E4E4]">Pricing</a>
            </div>
        </div>
        <div className="flex flex-col gap-3">
            <h1 className="text-1xl font-semibold text-[#E4E4E4]">
               Legal
            </h1>
            <div className="flex flex-col gap-1">
            <a href=""  className="font-semibold text-[#E4E4E4]">Terms of services</a>
            <a href=""  className="font-semibold text-[#E4E4E4]">Privacy policy</a>
            <a href=""  className="font-semibold text-[#E4E4E4]">Cookies policy</a>
            </div>
        </div>
        </div>
    </footer>
  )
}

export default Footer1