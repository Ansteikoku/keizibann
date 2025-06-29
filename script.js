import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://あなたのプロジェクト.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0eHd2cmpicnN3Z3FzZGN2Ym1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwOTk1ODksImV4cCI6MjA2NjY3NTU4OX0.xC5Xg3bgD8lTjSPodU1LW432A4zTWJXBsJ665mmExQU'
const supabase = createClient(supabaseUrl, supabaseKey)

// 投稿ID（必要に応じて変える。例: URLから取得するなど）
const postId = 1

const form = document.querySelector('#comment-form')
const commentInput = document.querySelector('#comment-input')
const commentList = document.querySelector('#comment-list')

// コメント送信処理
form.addEventListener('submit', async (e) => {
  e.preventDefault()
  const commentText = commentInput.value.trim()
  if (!commentText) return

  const { error } = await supabase.from('comments').insert([
    {
      comment_text: commentText,
      post_id: postId,
    }
  ])

  if (error) {
    console.error('コメント投稿エラー:', error.message)
  } else {
    commentInput.value = ''
    fetchComments()
  }
})

// コメント取得処理
async function fetchComments() {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('コメント取得エラー:', error.message)
    return
  }

  commentList.innerHTML = ''
  data.forEach(comment => {
    const li = document.createElement('li')
    li.textContent = comment.comment_text
    commentList.appendChild(li)
  })
}

fetchComments()
