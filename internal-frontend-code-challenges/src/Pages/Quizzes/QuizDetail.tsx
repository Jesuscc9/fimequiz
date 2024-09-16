import { Link, useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { Skeleton } from '../../components/Skeleton'
import { supabase } from '../../services/supabase'

export default function QuizDetail() {
  const { id } = useParams()

  const { isLoading, error, data } = useQuery(['quiz', id], async () => {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*, questions(*, options(*))')
      .eq('id', id)
      .single()

    if (error) {
      throw new Error(error.message) // Aseguramos que se lanza el error
    }

    return data
  })

  console.log(error)

  if (isLoading) return <Skeleton />
  if (error) return <div>An error has occurred</div>

  console.log(data)

  return (
    <div className='container'>
      <br />
      <div>
        <Link to='/'>Regresar</Link>
      </div>
      <br />
      <h5
        style={{
          marginBottom: 4
        }}
      >
        #{data.id}
      </h5>
      <h1>{data.instruction}</h1>
      <pre>{data.code}</pre>
      <div>
        {data.questions[0].options.map((e: any) => {
          const isCorrect = e.key === data.questions[0].correct_option_key
          return (
            <div key={e.id}>
              <button
                className={isCorrect ? 'primary' : 'secondary'}
                style={{ width: '100%' }}
                type='button'
                key={e.id}
              >
                {e.key.toUpperCase()}) {e.content}
              </button>
            </div>
          )
        })}
      </div>
      <p>Explicación: {data.questions[0].correct_option_explanation}</p>
      <p className='capitalize'>
        Inciso correcto: {data.questions[0].correct_option_key}
      </p>
    </div>
  )
}
