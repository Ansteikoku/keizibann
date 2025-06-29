import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = 'https://itxwvrjbrswgqsdcvbmh.supabase.co'
const SUPABASE_KEY = 'あなたのAnonキーをここに貼る'
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

let currentUser = null

// ログイン処理
const login = () => {
  const name = document.getElementById('name').value
  const password = document.getElementById('password').value

  if (password === 'わかくさ') {
    currentUser = name
    localStorage.setItem('userName', name)
    document.getElementById('login').style.display = 'none'
    document.getElementById('bbs').style.display = 'block'
    loadPosts()
  } else {
    document.getElementById('login-error').textContent = 'パスワードが違います'
  }
}

// 投稿処理（画像なし）
document.getElementById('postForm').addEventListener('submit', async (e) => {
  e.preventDefault()
  const comment = document.getElementById('comment').value

  await supabase.from('posts').insert([
    {
      user_name: currentUser,
      comment: comment,
    }
  ])

  document.getElementById('comment').value = ''
  loadPosts()
})

// 投稿一覧読み込み
const loadPosts = async () => {
  const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false })

  const postsDiv = document.getElementById('posts')
  postsDiv.innerHTML = ''

  data.forEach(post => {
    const div = document.createElement('div')
    div.className = 'post'
    div.innerHTML = `
      <p><strong>${post.user_name}</strong>: ${post.comment}</p>
      <hr />
    `
    postsDiv.appendChild(div)
  })
}

// ページ読み込み時：ログイン済みなら掲示板を表示
window.addEventListener('DOMContentLoaded', () => {
  const name = localStorage.getItem('userName')
  if (name) {
    currentUser = name
    document.getElementById('login').style.display = 'none'
    document.getElementById('bbs').style.display = 'block'
    loadPosts()
  }
})
