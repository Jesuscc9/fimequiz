export default {
  async fetch(request, env) {
    // Definir las categorías y subretos
    const challengeCategories = {
      'Basic Operations': [
        'A C code snippet that performs arithmetic operations (addition, subtraction, multiplication, division).',
        'A C code snippet that concatenates two strings.'
      ],
      'Control Structures': [
        'A C code snippet with a loop (for, while, or do-while) to iterate over an array.',
        'A C code snippet with a conditional statement (if-else, switch-case) that checks different conditions.'
      ],
      'Data Manipulation': [
        'A C code snippet that initializes and manipulates an array.',
        'A C code snippet that sorts an array using bubble sort.'
      ],
      'Functions and Procedures': [
        'A C code snippet that defines and calls a recursive function.',
        'A C code snippet that passes an array to a function and modifies its elements.'
      ],
      Algorithms: [
        'A C code snippet that implements a binary search.',
        'A C code snippet that calculates the factorial of a number using recursion.'
      ]
    }

    // Errores comunes
    const errorOptions = [
      'a missing semicolon',
      'an incorrect data type',
      'misuse of a function, like printf with an incorrect format specifier',
      'an array index out of bounds',
      'memory allocation without freeing the memory'
    ]

    // Seleccionar aleatoriamente una categoría, un subreto, y un error
    const selectedCategory =
      Object.keys(challengeCategories)[
        Math.floor(Math.random() * Object.keys(challengeCategories).length)
      ]
    const selectedTask =
      challengeCategories[selectedCategory][
        Math.floor(Math.random() * challengeCategories[selectedCategory].length)
      ]
    const selectedError =
      errorOptions[Math.floor(Math.random() * errorOptions.length)]

    let messages = [
      {
        role: 'system',
        content:
          'You are a helpful assistant specialized in creating programming challenges.'
      },
      {
        role: 'user',
        content: `
        Generate a random programming challenge in C. The challenge should include:
        1. ${selectedTask}
        2. Introduce ${selectedError} in the code.
        3. Create a multiple-choice question to identify the error in the code, providing four answer options, one of which is correct.
        4. Provide an explanation of the error and how to correct it.
        Format the response in JSON with the following keys: code_snippet, question, options, and explanation.
        `
      }
    ]

    const response = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
      messages
    })

    return Response.json({ response })
  }
}
