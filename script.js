import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://itxwvrjbrswgqsdcvbmh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...（省略）'
const supabase = createClient(supabaseUrl, supabaseKey)

let currentUser = null

const login = () => {
  const name = document.getElementById('name').value
  const password = document.getElementById('password').value

  // ここでパスワードをチェック（wakakusaに変更）
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
  if (!comment.trim()) return

  await supabase.from('posts').insert([
    {
      user_name: currentUser,
      comment: comment
    }
  ])

  document.getElementById('comment').value = ''
  loadPosts()
})

const loadPosts = async () => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })

  const postsDiv = document.getElementById('posts')
  postsDiv.innerHTML = ''

  if (error) {
    postsDiv.innerHTML = '<p>投稿の取得に失敗しました。</p>'
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

window.login = login // login関数をグローバルに登録
