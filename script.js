const SUPABASE_URL = 'https://itxwvrjbrswgqsdcvbmh.supabase.co' // ← あなたのURL
const SUPABASE_KEY = 'process.env.SUPABASE_KEY'             // ← あなたのAnonキー
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY)

let currentUser = null

// ログイン処理
const login = () => {
  const name = document.getElementById('name').value
  const password = document.getElementById('password').value

  if (password === 'wakakusa') {
    currentUser = name
    localStorage.setItem('userName', name) // ← ログイン名を保存
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
    const { data, error } = await supabase.storage.from('your-bucket').upload(fileName, imageFile)
    if (error) {
      alert('画像アップロードに失敗しました')
      return
    }
    const { data: publicUrl } = supabase.storage.from('your-bucket').getPublicUrl(fileName)
    image_url = publicUrl.publicUrl
  }

  await supabase.from('posts').insert([
    {
      user_name: currentUser,
      comment: comment,
      image_url: image_url
    }
  ])

  document.getElementById('comment').value = ''
  document.getElementById('image').value = ''
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
