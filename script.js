import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = 'https://itxwvrjbrswgqsdcvbmh.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0eHd2cmpicnN3Z3FzZGN2Ym1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwOTk1ODksImV4cCI6MjA2NjY3NTU4OX0.xC5Xg3bgD8lTjSPodU1LW432A4zTWJXBsJ665mmExQU'
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

let currentUser = null

const login = () => {
  const name = document.getElementById('name').value
  const password = document.getElementById('password').value

  if (password === 'wakakusa') {
    currentUser = name
    localStorage.setItem('userName', name)
    document.getElementById('login').style.display = 'none'
    document.getElementById('bbs').style.display = 'block'
    loadPosts()
  } else {
    document.getElementById('login-error').textContent = 'パスワードが違います'
  }
}

document.getElementById('postForm').addEventListener('submit', async (e) => {
  e.preventDefault()
  const comment = document.getElementById('comment').value
  const imageFile = document.getElementById('image').files[0]

  let image_url = ''
  if (imageFile) {
    const fileName = Date.now() + '_' + imageFile.name
    const { data, error } = await supabase.storage.from('images').upload(fileName, imageFile)
    if (error) {
      alert('画像アップロードに失敗しました')
      return
    }
    const { data: publicUrl } = supabase.storage.from('images').getPublicUrl(fileName)
    image_url = publicUrl.publicUrl
  }

  await supabase.from('posts').insert([{
    user_name: currentUser,
    comment: comment,
    image_url: image_url
  }])

  document.getElementById('comment').value = ''
  document.getElementById('image').value = ''
  loadPosts()
})

const loadPosts = async () => {
  const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false })
  const postsDiv = document.getElementById('posts')
  postsDiv.innerHTML = ''

  data.forEach(post => {
    const div = document.createElement('div')
    div.className = 'post'
    div.innerHTML = `
      <p><strong>${post.user_name}</strong>: ${post.comment}</p>
      ${post.image_url ? `<img src="${post.image_url}" width="200"/>` : ''}
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

// HTML の onclick に対応させる
window.login = login
