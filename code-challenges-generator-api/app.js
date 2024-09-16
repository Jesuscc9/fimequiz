export default {
  async fetch(request, env) {
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

    const errorOptions = [
      'a missing semicolon',
      'an incorrect data type',
      'misuse of a function, like printf with an incorrect format specifier',
      'an array index out of bounds',
      'memory allocation without freeing the memory'
    ]

    const getRandomElement = (array) =>
      array[Math.floor(Math.random() * array.length)]

    const selectedCategory = getRandomElement(Object.keys(challengeCategories))
    const selectedTask = getRandomElement(challengeCategories[selectedCategory])
    const selectedError = getRandomElement(errorOptions)

    const messages = [
      {
        role: 'system',
        content:
          'You are a Spanish JSON generator that only outputs valid JSON objects. Do not include any explanations, comments, or additional text. You are a programming teacher.'
      },
      {
        role: 'user',
        content: `
        Generate a random programming challenge in C with the following structure and in Spanish:
        {
          "code": "C code here",
          "title": "Title of the challenge",
          "question": {
            "type": "multiple-choice",
            "options": [
              {"id": 0, "key": "a", "content": "Option A"},
              {"id": 1, "key": "b", "content": "Option B"},
              {"id": 2, "key": "c", "content": "Option C"},
              {"id": 3, "key": "d", "content": "Option D"}
            ],
            "correct_option_key": "key of the correct option"
          },
          "instruction": "Instruction must be a question. The instruction must led the user to select the right answer based on the provided code with an error. Remember the context is a MOBILE GAME that works as a programming quiz.",
          "correct_option_explanation": "Explanation for why the correct option is correct",
          "correct_code": "Corrected C code here"
        }
        Return only the JSON object with no extra text or comments, and ensure that it is well-formed and complete.
        `
      }
    ]

    try {
      const aiResponse = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
        stream: false, // Ensure streaming is disabled for a traditional response
        max_tokens: 512,
        messages: messages
      })

      const parsedResponse = JSON.parse(aiResponse.response)

      // Validate the parsedResponse
      if (
        parsedResponse &&
        parsedResponse.code &&
        parsedResponse.question &&
        Array.isArray(parsedResponse.question.options) &&
        parsedResponse.instruction &&
        parsedResponse.correct_option_explanation &&
        typeof parsedResponse.correct_code === 'string' &&
        typeof parsedResponse.question.correct_option_key === 'string'
      ) {
        return Response.json(parsedResponse)
      } else {
        return Response.json(
          {
            error: 'Invalid response structure from AI.',
            rawContent: aiResponse.response
          },
          { status: 500 }
        )
      }
    } catch (error) {
      return Response.json(
        { error: 'Failed to parse the JSON from AI response.' },
        { status: 500 }
      )
    }
  }
}
