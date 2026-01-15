import profile from "./data/profile.json";

export default function App() {
  return (
    <div className="page">
      <header className="hero" id="overview">
        <nav className="nav">
          <span className="logo">MirAI-POST</span>
          <div className="nav-links">
            <a href="#profile">プロフィールDB</a>
            <a href="#capability">能力・実装</a>
            <a href="#proof">実績DB</a>
            <a href="#philosophy">哲学</a>
            <a href="#community">コミュニティ</a>
            <a href="#collab">協業</a>
          </div>
        </nav>

        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">再現性PR OS</p>
            <h1>
              {profile.identity.name}の人格・実績・再現性を
              <span>一目で伝える</span>ページ
            </h1>
            <p className="lead">
              {profile.identity.coreWorldview}
              MirAI-POSTは、人格と成果の“再現可能な理由”を集約する。
            </p>
            <div className="hero-actions">
              <a className="primary" href="#community">
                コミュニティ設計を見る
              </a>
              <a className="ghost" href="#proof">
                実績DBへ
              </a>
            </div>
            <div className="hero-tags">
              {profile.highlights.slice(0, 3).map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
          <div className="hero-panel">
            <div className="stat-grid">
              {profile.heroStats.map((stat) => (
                <div className="stat-card" key={stat.label}>
                  <p>{stat.label}</p>
                  <h3>{stat.value}</h3>
                </div>
              ))}
            </div>
            <div className="hero-quote">
              <p>
                {profile.identity.oneLiner}
              </p>
            </div>
          </div>
        </div>
      </header>

      <section className="section" id="profile">
        <div className="section-head">
          <p className="eyebrow">プロフィールDB</p>
          <h2>人格と再現性を可視化する</h2>
        </div>
        <div className="profile-grid">
          <article className="card profile-card">
            <p className="profile-label">{profile.identity.title}</p>
            <h3>{profile.identity.coreWorldview}</h3>
            <p>{profile.identity.oneLiner}</p>
            <ul className="list">
              {profile.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="card timeline-card">
            <p className="profile-label">人生年表（要約）</p>
            <div className="timeline">
              {profile.timeline.map((item) => (
                <div className="timeline-item" key={item.year}>
                  <span className="timeline-year">{item.year}</span>
                  <p>{item.event}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
        <div className="profile-meta">
          <article className="card">
            <p className="profile-label">基本情報</p>
            <div className="meta-grid">
              <div>
                <h4>肩書</h4>
                <p>{profile.identity.role}</p>
              </div>
              <div>
                <h4>ブランド</h4>
                <p>{profile.identity.brand}</p>
              </div>
              <div>
                <h4>出身</h4>
                <p>{profile.identity.origin}</p>
              </div>
              <div>
                <h4>学歴</h4>
                <p>{profile.identity.education}</p>
              </div>
            </div>
          </article>
          <article className="card">
            <p className="profile-label">特性</p>
            <ul className="list">
              {profile.traits.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="card">
            <p className="profile-label">資格・役職</p>
            <ul className="list">
              {profile.credentials.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="section" id="capability">
        <div className="section-head">
          <p className="eyebrow">能力・実装</p>
          <h2>プロジェクトを動かす基盤</h2>
        </div>
        <div className="capability-grid">
          <article className="card">
            <p className="profile-label">取り組み</p>
            <div className="initiative-grid">
              {profile.initiatives.map((item) => (
                <div className="initiative-item" key={item.title}>
                  <h4>{item.title}</h4>
                  <p>{item.detail}</p>
                </div>
              ))}
            </div>
          </article>
          <article className="card">
            <p className="profile-label">技術スタック</p>
            <div className="skill-grid">
              <div>
                <h4>Languages</h4>
                <p>{profile.skills.languages.join(", ")}</p>
              </div>
              <div>
                <h4>Frameworks</h4>
                <p>{profile.skills.frameworks.join(", ")}</p>
              </div>
              <div>
                <h4>Infra</h4>
                <p>{profile.skills.infra.join(", ")}</p>
              </div>
              <div>
                <h4>AI/ML</h4>
                <p>{profile.skills.ai.join(", ")}</p>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="section" id="repro">
        <div className="section-head">
          <p className="eyebrow">再現性の型</p>
          <h2>結果を再現するための設計思想</h2>
        </div>
        <div className="grid three">
          {profile.corePrinciples.map((item, index) => (
            <article className="card stagger" style={{ "--delay": `${index * 120}ms` }} key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="proof">
        <div className="section-head">
          <p className="eyebrow">実績DB</p>
          <h2>数値で語れる、信頼の証明</h2>
        </div>
        <div className="grid three">
          {profile.proofs.map((item, index) => (
            <article className="card proof" style={{ "--delay": `${index * 80}ms` }} key={item.title}>
              <span className="tag">{item.tag}</span>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="philosophy">
        <div className="section-head">
          <p className="eyebrow">哲学</p>
          <h2>世界観を言語化して、仲間を集める</h2>
        </div>
        <div className="grid two">
          {profile.philosophy.map((item, index) => (
            <article className="card quote" style={{ "--delay": `${index * 120}ms` }} key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="community">
        <div className="section-head">
          <p className="eyebrow">コミュニティ設計</p>
          <h2>強いファンを生む「思考の道場」</h2>
        </div>
        <div className="community-layout">
          <div className="community-copy">
            <p>
              速さに憧れる人ではなく、構造に共鳴する人を集める。
              結果の裏側にある判断と設計を共有し、再現性を鍛える。
            </p>
            <ul className="list">
              <li>対象: 経営者 / 起業志望</li>
              <li>目的: 再現性のあるプロジェクト量産</li>
              <li>価値: 意思決定の言語化と構造化</li>
            </ul>
          </div>
          <div className="grid three">
            {profile.communityDesign.map((item, index) => (
              <article className="card stagger" style={{ "--delay": `${index * 120}ms` }} key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="collab">
        <div className="section-head">
          <p className="eyebrow">協業</p>
          <h2>私にないスキルを持つ仲間と組む</h2>
        </div>
        <div className="card collab">
          <p>
            MirAI-POSTは単独の成果ではなく、プロジェクトを量産して世界を変えるための基盤。<br />
            互いの強みを持ち寄り、再現性のある挑戦を増やしたい。
          </p>
          <ul className="list">
            {profile.partnerNeeds.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="hero-actions">
            <a className="primary" href={`mailto:${profile.contactEmail}`}>
              協業の相談をする
            </a>
            <a className="ghost" href="#overview">
              もう一度全体を見る
            </a>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>MirAI-POST | Reproducible Branding OS</p>
      </footer>
    </div>
  );
}
