// SupabaseクライアントをESMとしてインポート
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// Supabaseプロジェクト情報
const SUPABASE_URL = 'https://itxwvrjbrswgqsdcvbmh.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0eHd2cmpicnN3Z3FzZGN2Ym1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwOTk1ODksImV4cCI6MjA2NjY3NTU4OX0.xC5Xg3bgD8lTjSPodU1LW432A4zTWJXBsJ665mmExQU'

// Supabaseクライアント作成
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

let currentUser = null

// ログイン処理
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

// 投稿処理
document.getElementById('postForm').addEventListener('submit', async (e) => {
  e.preventDefault()
  const comment = document.getElementById('comment').value
  const imageFile = document.getElementById('image').files[0]

  let image_url = ''
  if (imageFile) {
    const fileName = Date.now() + '_' + imageFile.name
    const { error: uploadError } = await supabase.storage.from('images').upload(fileName, imageFile)

    if (uploadError) {
      alert('画像アップロードに失敗しました')
      return
    }

    const { data: publicUrl } = supabase.storage.from('images').getPublicUrl(fileName)
    image_url = publicUrl.publicUrl
  }

  const { error: insertError } = await supabase.from('posts').insert([
    {
      user_name: currentUser,
      comment: comment,
      image_url: image_url
    }
  ])

  if (insertError) {
    alert('投稿に失敗しました')
    return
  }

  document.getElementById('comment').value = ''
  document.getElementById('image').value = ''
  loadPosts()
})

// 投稿一覧読み込み
const loadPosts = async () => {
  const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false })

  if (error) {
    alert('投稿の読み込みに失敗しました')
    return
  }

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

// login関数をグローバルに公開（HTMLのonclick用）
window.login = login
