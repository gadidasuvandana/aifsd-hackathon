# Business to developer assistant
## Team Prompt Rangers

* We want to streamline the process between the BA and developers
* This app is a guided journey to generate backend code( API code) from an idea or a brainstorming session
* Non technical people can use this site to generate sequence diagram for the needed acceptance criteria
* The generated sequence follows the stamdard puml format
* The step helps generate a OpenAPI spec on the given sequence diagram
* Given a openapi spec, we can generate test cases based on a preferred language
* Choose a database and see the magic run, code is generated to satisfy the test cases


To run this app
* Have ollama installed
* Run `ollama pull gemma3`
* Run `ollama run gemma3`
* To run the react app `npm run dev`

Assumes node version > 18