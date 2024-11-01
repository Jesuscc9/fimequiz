export default {
  async fetch(request, env) {
    // Helper function to get a random element from an array
    const getRandomElement = (array) =>
      array[Math.floor(Math.random() * array.length)]

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

    const difficultyLevels = ['easy', 'medium', 'hard']

    const selectedCategory = getRandomElement(Object.keys(challengeCategories))
    const selectedTask = getRandomElement(challengeCategories[selectedCategory])
    const selectedError = getRandomElement(errorOptions)
    const selectedDifficulty = getRandomElement(difficultyLevels)

    // Step 1: Generate the C code and the challenge title with more standardization
    const messagesStep1 = [
      {
        role: 'system',
        content:
          'You are a Spanish programming quiz generator for a mobile game. Always output valid JSON, and make sure the code snippet contains an error.'
      },
      {
        role: 'user',
        content: `
        Generate a random C programming challenge from the category "${selectedCategory}". Follow this structure exactly:
        {
          "code": "A valid C code snippet related to ${selectedTask}, containing an intentional error like ${selectedError}",
          "title": "A short and descriptive title that reflects the task related to ${selectedTask} from the category ${selectedCategory}"
        }
        Make sure the code contains only one error, and the title accurately describes the purpose of the code. Do not include explanations or comments, just the JSON.
        `
      }
    ]

    const aiResponseStep1 = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
      stream: false,
      max_tokens: 512,
      messages: messagesStep1
    })

    const parsedResponseStep1 = JSON.parse(aiResponseStep1.response)

    // Step 2: Generate the multiple-choice question and options
    const messagesStep2 = [
      {
        role: 'system',
        content:
          'You are a Spanish programming quiz generator for a mobile game. Only output valid JSON.'
      },
      {
        role: 'user',
        content: `
        Generate a multiple-choice question for the following C code challenge. Return the question and options in JSON format:
        {
          "question": {
            "type": "multiple-choice",
            "options": [
              {"id": 0, "key": "a", "content": "Option A"},
              {"id": 1, "key": "b", "content": "Option B"},
              {"id": 2, "key": "c", "content": "Option C"},
              {"id": 3, "key": "d", "content": "Option D"}
            ],
            "correct_option_key": "key of the correct option"
          }
        }
        `
      }
    ]

    const aiResponseStep2 = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
      stream: false,
      max_tokens: 512,
      messages: messagesStep2
    })

    const parsedResponseStep2 = JSON.parse(aiResponseStep2.response)

    // Step 3: Generate the instruction and explanation for the correct option
    const messagesStep3 = [
      {
        role: 'system',
        content:
          'You are a Spanish programming quiz generator for a mobile game. Only output valid JSON.'
      },
      {
        role: 'user',
        content: `
        For the following challenge, provide the instruction as a question and the explanation of the correct option:
        {
          "instruction": "Instruction must lead the user to select the right answer based on the provided code.",
          "correct_option_explanation": "Explanation for why the correct option is correct"
        }
        `
      }
    ]

    const aiResponseStep3 = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
      stream: false,
      max_tokens: 512,
      messages: messagesStep3
    })

    const parsedResponseStep3 = JSON.parse(aiResponseStep3.response)

    // Step 4: Generate the corrected version of the C code
    const messagesStep4 = [
      {
        role: 'system',
        content:
          'You are a Spanish programming quiz generator for a mobile game. Only output valid JSON.'
      },
      {
        role: 'user',
        content: `
        Generate the corrected version of the following C code challenge:
        {
          "correct_code": "Corrected C code here"
        }
        `
      }
    ]

    const aiResponseStep4 = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
      stream: false,
      max_tokens: 512,
      messages: messagesStep4
    })

    const parsedResponseStep4 = JSON.parse(aiResponseStep4.response)

    // Combine all parts into one final JSON object including the difficulty level
    const finalChallenge = {
      ...parsedResponseStep1,
      ...parsedResponseStep2,
      ...parsedResponseStep3,
      ...parsedResponseStep4,
      difficulty: selectedDifficulty // Adding the difficulty level to the final output
    }

    return Response.json(finalChallenge)
  }
}
