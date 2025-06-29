<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <title>コメント機能</title>
</head>
<body>
  <h2>コメント一覧</h2>
  <div id="comments"></div>

  <h3>コメントを投稿する</h3>
  <form id="comment-form">
    <input type="text" id="comment-text" placeholder="コメントを入力" required />
    <button type="submit">送信</button>
  </form>

  <!-- Supabase用のスクリプト -->
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js"></script>
  <script>
    // SupabaseのURLとKEYをここに入力
    const SUPABASE_URL = 'https://itxwvrjbrswgqsdcvbmh.supabase.co'; // ← 自分のURLに置き換えて
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0eHd2cmpicnN3Z3FzZGN2Ym1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwOTk1ODksImV4cCI6MjA2NjY3NTU4OX0.xC5Xg3bgD8lTjSPodU1LW432A4zTWJXBsJ665mmExQU';             // ← 自分のanonキーに置き換えて

    const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    const postId = 1; // ← 投稿ID。固定でもURLから取得でもOK

    async function fetchComments() {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('読み込みエラー:', error);
        return;
      }

      const commentsDiv = document.getElementById('comments');
      commentsDiv.innerHTML = '';
      data.forEach(comment => {
        const p = document.createElement('p');
        p.textContent = comment.comment_text;
        commentsDiv.appendChild(p);
      });
    }

    // コメント送信処理
    document.getElementById('comment-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const commentText = document.getElementById('comment-text').value;

      const { error } = await supabase.from('comments').insert([
        {
          post_id: postId,
          comment_text: commentText
        }
      ]);

      if (error) {
        console.error('投稿エラー:', error);
        return;
      }

      document.getElementById('comment-text').value = '';
      fetchComments(); // 再読み込み
    });

    // 初期読み込み
    fetchComments();
  </script>
</body>
</html>
