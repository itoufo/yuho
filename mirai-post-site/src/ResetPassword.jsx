import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

export default function ResetPassword() {
  const [phase, setPhase] = useState("exchanging");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const url = new URL(window.location.href);
      const errorParam = url.searchParams.get("error");
      const errorDescription = url.searchParams.get("error_description");
      const code = url.searchParams.get("code");

      if (errorParam) {
        if (cancelled) return;
        setPhase("error");
        setError(errorDescription || errorParam);
        return;
      }

      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(
          window.location.href,
        );
        if (cancelled) return;
        if (exchangeError) {
          setPhase("error");
          setError(
            `認証に失敗しました: ${exchangeError.message}（リンクの有効期限切れ、または同じブラウザで再設定リクエストを行っていない可能性があります）`,
          );
          return;
        }
        // クエリをURLから消す
        window.history.replaceState({}, "", window.location.pathname);
        setPhase("ready");
        return;
      }

      // code が無くても、既にセッションが復元できれば続行
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (cancelled) return;
      if (session) {
        setPhase("ready");
        return;
      }

      setPhase("error");
      setError(
        "リカバリーコードが見つかりません。メールに記載されたリンクをもう一度クリックしてください。リンクは1時間で失効します。",
      );
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("パスワードは8文字以上にしてください");
      return;
    }
    if (password !== confirm) {
      setError("確認用パスワードが一致しません");
      return;
    }

    setPhase("submitting");
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setPhase("ready");
      setError(`パスワード更新に失敗しました: ${updateError.message}`);
      return;
    }
    await supabase.auth.signOut();
    setPhase("success");
  };

  return (
    <div className="reset-page">
      <div className="reset-card">
        <p className="reset-eyebrow">MirAI POST</p>
        <h1 className="reset-title">パスワードの再設定</h1>

        {phase === "exchanging" && (
          <p className="reset-status">リンクを検証しています…</p>
        )}

        {phase === "error" && (
          <>
            <p className="reset-error">{error}</p>
            <p className="reset-hint">
              再度パスワード再設定をリクエストしてください。リンクをクリックする際は、
              リクエストを行ったブラウザと同じブラウザ・端末で開く必要があります。
            </p>
          </>
        )}

        {(phase === "ready" || phase === "submitting") && (
          <form className="reset-form" onSubmit={onSubmit}>
            <label className="reset-field">
              <span>新しいパスワード</span>
              <input
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={phase === "submitting"}
                minLength={8}
                required
              />
            </label>
            <label className="reset-field">
              <span>新しいパスワード(確認)</span>
              <input
                type="password"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                disabled={phase === "submitting"}
                minLength={8}
                required
              />
            </label>
            {error && <p className="reset-error">{error}</p>}
            <button
              type="submit"
              className="reset-submit"
              disabled={phase === "submitting"}
            >
              {phase === "submitting" ? "更新中…" : "パスワードを更新する"}
            </button>
            <p className="reset-hint">8文字以上で設定してください。</p>
          </form>
        )}

        {phase === "success" && (
          <>
            <p className="reset-status reset-success">
              パスワードを更新しました。新しいパスワードでログインしてください。
            </p>
            <p className="reset-hint">
              このタブは閉じて構いません。元のアプリのログイン画面に戻り、新しいパスワードで再ログインしてください。
            </p>
          </>
        )}
      </div>
    </div>
  );
}
