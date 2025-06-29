import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = 'https://itxwvrjbrswgqsdcvbmh.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

let currentUser = null

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
    document.getElementById('login-error').textContent = 'パスワードがちがいます'
  }
}

document.getElementById('postForm').addEventListener('submit', async (e) => {
  e.preventDefault()
  const comment = document.getElementById('comment').value

  if (!comment.trim()) return

  const { error } = await supabase.from('Text').insert([{
    user_name: currentUser,
    comment: comment
  }])

  if (error) {
    alert('投稿に失敗しました')
    return
  }

  document.getElementById('comment').value = ''
  loadPosts()
})

const loadPosts = async () => {
  const { data, error } = await supabase.from('Text').select('*').order('created_at', { ascending: false })
  const postsDiv = document.getElementById('posts')
  postsDiv.innerHTML = ''

  if (error) {
    postsDiv.innerHTML = '<p>投稿の読み込みに失敗しました</p>'
    return
  }

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

window.addEventListener('DOMContentLoaded', () => {
  const name = localStorage.getItem('userName')
  if (name) {
    currentUser = name
    document.getElementById('login').style.display = 'none'
    document.getElementById('bbs').style.display = 'block'
    loadPosts()
  }
})
