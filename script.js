import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// Supabase設定
const supabaseUrl = 'https://itxwvrjbrswgqsdcvbmh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...省略...'
const supabase = createClient(supabaseUrl, supabaseKey)

// 投稿IDは固定（スレッド無し仕様）
const postId = 1

// 要素取得
const form = document.querySelector('#comment-form')
const commentInput = document.querySelector('#comment-input')
const commentList = document.querySelector('#comment-list')

// ログイン処理
window.login = () => {
  const password = document.getElementById('password').value
  const name = document.getElementById('username').value

  if (password === 'わかくさ' && name.trim() !== '') {
    localStorage.setItem('username', name)
    document.getElementById('login').style.display = 'none'
    document.getElementById('main').style.display = 'block'
    fetchComments()
  } else {
    document.getElementById('error').textContent = 'パスワードが違います'
  }
}

// 自動ログイン
window.addEventListener('DOMContentLoaded', () => {
  const name = localStorage.getItem('username')
  if (name) {
    document.getElementById('login').style.display = 'none'
    document.getElementById('main').style.display = 'block'
    fetchComments()
  }
})

// コメント送信
form.addEventListener('submit', async (e) => {
  e.preventDefault()
  const commentText = commentInput.value.trim()
  const userName = localStorage.getItem('username') || '匿名'

  if (!commentText) return

  const { error } = await supabase.from('comments').insert([
    {
      comment_text: commentText,
      post_id: postId,
      user_name: userName
    }
  ])

  if (error) {
    console.error('コメント投稿エラー:', error.message)
  } else {
    commentInput.value = ''
    fetchComments()
  }
})

// コメント取得
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
    li.textContent = `${comment.user_name}: ${comment.comment_text}`
    commentList.appendChild(li)
  })
}
