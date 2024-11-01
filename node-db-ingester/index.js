// Cargar las variables del archivo .env usando import
import 'dotenv/config' // Usamos dotenv para cargar las variables de entorno

// ASSIGNMENT_AND_ARITHMETIC_OPERATIONS, SIMPLE_CONDITIONALS, NESTED_CONDITIONALS, BASIC_LOOPS, BASIC_ARRAYS
const TOPICS_IDS_ENUM = {
  ASSIGNMENT_AND_ARITHMETIC_OPERATIONS: 1,
  SIMPLE_CONDITIONALS: 2,
  NESTED_CONDITIONALS: 3,
  BASIC_LOOPS: 4,
  BASIC_ARRAYS: 5
}

// Importar las bibliotecas necesarias
import fetch from 'node-fetch'
import * as xlsx from 'xlsx'
import fs from 'fs'

// Función para hacer el fetch y guardar en el archivo de Excel
async function fetchAndSaveData() {
  try {
    // Hacer el fetch al endpoint
    const response = await fetch(
      'https://code-challenges-generator-api.jesus-cervantes0801.workers.dev/'
    )
    const data = await response.json()

    // Mostrar los datos para verificar (opcional)
    console.log('Datos recibidos:', data)

    // Formatear los datos en un formato adecuado para Excel
    const quizData = [
      {
        Code: data.code,
        Instruction: data.instruction,
        Correct_Code: data.correct_code
      }
    ]

    const questionData = [
      {
        Quiz_ID: 1, // Asumiendo que este es el ID único para el Excel
        Correct_Option_Key: data.question.correct_option_key,
        Correct_Option_Explanation: data.correct_option_explanation,
        Topic_ID: TOPICS_IDS_ENUM[data.topic]
      }
    ]

    const optionsData = data.question.options.map((option, index) => ({
      Question_ID: 1, // Asumiendo que este es el ID único para el Excel
      Option_Key: option.key,
      Option_Content: option.content
    }))

    // Crear libro de Excel y hojas de trabajo
    const workbook = xlsx.utils.book_new()

    // Agregar datos a hojas separadas
    const quizSheet = xlsx.utils.json_to_sheet(quizData)
    const questionSheet = xlsx.utils.json_to_sheet(questionData)
    const optionsSheet = xlsx.utils.json_to_sheet(optionsData)

    // Agregar hojas al libro
    xlsx.utils.book_append_sheet(workbook, quizSheet, 'Quizzes')
    xlsx.utils.book_append_sheet(workbook, questionSheet, 'Questions')
    xlsx.utils.book_append_sheet(workbook, optionsSheet, 'Options')

    // Guardar el archivo Excel
    const filePath = './challenge_data.xlsx'
    xlsx.writeFile(workbook, filePath)

    console.log('Datos guardados correctamente en el archivo Excel:', filePath)
  } catch (error) {
    console.error('Error al guardar los datos:', error.message)
  }
}

// Ejecutar la función para realizar el fetch y guardar los datos
fetchAndSaveData()
