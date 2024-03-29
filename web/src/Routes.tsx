// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Router, Route } from '@redwoodjs/router'

const Routes = () => {
  return (
    <Router>
      <Route path="/hugging-face" page={HuggingFacePage} name="huggingFace" />
      <Route path="/mistral-ai" page={MistralAIPage} name="mistralAi" />
      <Route path="/open-ai-assistant" page={OpenAIAssistantPage} name="openAiAssistant" />
      <Route path="/hugging-face-interface" page={HuggingFaceInterfacePage} name="huggingFaceInterface" />
      <Route path="/hugging-face-agent" page={HuggingFaceAgentPage} name="huggingFaceAgent" />
      <Route path="/home" page={HomePage} name="home" />
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
