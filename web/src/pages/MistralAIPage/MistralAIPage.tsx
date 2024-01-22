import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

const MistralAiPage = () => {
  return (
    <>
      <Metadata title="MistralAi" description="MistralAi page" />

      <h1>MistralAiPage</h1>
      <p>
        Find me in <code>./web/src/pages/MistralAIPage/MistralAIPage.tsx</code>
      </p>
      <p>
        My default route is named <code>mistralAi</code>, link to me with `
        <Link to={routes.mistralAi()}>MistralAi</Link>`
      </p>
    </>
  )
}

export default MistralAiPage
