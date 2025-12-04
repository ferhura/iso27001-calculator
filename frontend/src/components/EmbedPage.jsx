import Calculator from './Calculator'

const EmbedPage = () => {
  return (
    <div className="min-h-fit bg-white p-1">
      <div className="w-full">
        <Calculator isIframe={true} />
      </div>
    </div>
  )
}

export default EmbedPage