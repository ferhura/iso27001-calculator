import Calculator from './Calculator'

const DesktopPage = () => {
  return (
    <div className="min-h-fit bg-white p-1">
      <div className="w-full">
        <Calculator isDesktop={true} />
      </div>
    </div>
  )
}

export default DesktopPage