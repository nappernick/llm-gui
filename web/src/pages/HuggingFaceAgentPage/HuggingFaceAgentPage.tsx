import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

const HuggingFaceAgentPage = () => {
  return (
    <>
      <Metadata title="HuggingFaceAgent" description="HuggingFaceAgent page" />

      <h1>HuggingFaceAgentPage</h1>
      <p>
        Find me in{' '}
        <code>
          ./web/src/pages/HuggingFaceAgentPage/HuggingFaceAgentPage.tsx
        </code>
      </p>
      <p>
        My default route is named <code>huggingFaceAgent</code>, link to me with
        `<Link to={routes.huggingFaceAgent()}>HuggingFaceAgent</Link>`
      </p>
    </>
  )
}

export default HuggingFaceAgentPage
