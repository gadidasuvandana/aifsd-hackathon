export const generatePlantUMLPrompt = (requirements) => {
    return `
    You are a PlantUML expert.
    Create a PlantUML sequence diagram using the latest syntax
     for the following business requirements. Follow these rules strictly:

1. Use ONLY @startuml and @enduml tags (DO NOT use @plantuml)
2. Use proper sequence diagram syntax:
   - Use 'participant' for main actors
   - Use 'actor' for external users
   - Use 'boundary' for UI elements
   - Use 'control' for controllers
   - Use 'entity' for data objects
3. Message syntax:
   - Use '->' for synchronous messages
   - Use '-->' for return messages
   - Use '-[#color]->' for colored messages
   - Use 'note left/right' for notes
4. Activation:
   - Use 'activate' and 'deactivate' for lifelines
   - Use '++' and '--' for automatic activation
5. Include proper spacing and alignment
6. Use proper indentation
7. Only return the PlantUML code without any explanation or markdown formatting
8. DO NOT use any deprecated syntax or @plantuml tag

Business Requirements:
${requirements}`
}