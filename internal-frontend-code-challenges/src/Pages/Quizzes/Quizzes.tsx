import { useState } from 'react'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { Skeleton } from '../../components/Skeleton'
import { supabase } from '../../services/supabase'

export default function Quizzes() {
  const [quizesParams] = useState({
    from: 0,
    to: 500
  })

  const { isLoading, error, data } = useQuery(
    ['quizzes', quizesParams],
    async (params) => {
      const { from, to } = params?.queryKey[1] as { from: number; to: number }
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .range(from, to)

      if (error) throw new Error(error.message)
      return data
    }
  )

  console.log(data)

  if (isLoading) return <Skeleton />
  if (error) return <div>An error has occurred</div>

  return (
    <div className='container'>
      <br />
      <h1>Quizzes</h1>
      {data?.map((quiz) => (
        <div key={quiz.id}>
          <div key={quiz.id}>
            <Link className='secondary' to={`/quiz/${quiz.id}`}>
              {quiz.id} - {quiz.instruction}
            </Link>
          </div>
          <br />
        </div>
      ))}
    </div>
  )
}
