import ButtonAlign1 from "../ButtonAlign/ButtonAlign1"

const Mainhero2 = () => {
  return (
    <main className="w-full mt-10 h-full items-center flex flex-col gap-3">
        <div className="flex-col items-center justify-between flex gap-1">
            <h1 className="text-4xl md:text-8xl text-[#E4E4E4]">Patients, not</h1>
            <h1 className="text-4xl md:text-8xl text-[#E4E4E4]">Paperwork</h1>
        </div>
        <div className="flex-col items-center justify-between flex gap-1">
            <h1 className="text-2xl md:text-2xl text-[#E4E4E4]">Enjoy unlimited gold-standard transcriptions</h1>
            <h1 className="text-2xl md:text-2xl text-[#E4E4E4]">Write letters instantantly like it was you</h1>
            <h1 className="text-2xl md:text-2xl text-[#E4E4E4]">Save 5+ hours in paperworks</h1>
        </div>
        <ButtonAlign1></ButtonAlign1>
    </main>
  )
}

export default Mainhero2