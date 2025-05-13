# ThoughtFlowAI
# Team Prompt Rangers
    Point Of Contact - Vandana Gadidasu [Developer] <vandana.gadidasu@thoughtworks.com>
    Dipti Munjal [Developer]
    Jeena Mary George [Developer]
    Puneet Rekhi [Infra Developer]
    


We spend a majority of our time trying to brainstorm solutions and a visual ideas are our best way out. 
We don’t have formal ways  of translating business ideas to code in a structured and software industry accepted format. 
This app is a guided journey to generate backend code( API code) from an idea or a brainstorming session
Gemma3 is being used as the LLM Model for generations

## How to use this app
* Non-technical people can use this tool to generate sequence diagram for the needed acceptance criteria
* The generated sequence follows the standard PUML format
* OpenAPI spec can then be created from generated sequence diagram
* Given an OpenAPI spec, we can generate test cases based on a preferred language
* Choose a database and see the magic run, code is generated to satisfy the test cases

## Pre-requisites
* Have ollama installed
* Run `ollama pull gemma3`
* Run `ollama run gemma3`

## How To run this app
* Run `npm install`
* Run react app `npm run dev`
Assumes node version > 18