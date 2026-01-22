import { useTranslation } from 'react-i18next';
import './ReferencePage.css';

function ReferencePage() {
  const { t } = useTranslation();
  return (
    <div className="reference-page">
      <h1>{t('referencePage.title')}</h1>
      <p className="subtitle">{t('referencePage.subtitle')}</p>

      <div className="reference-grid">
        {/* Logical Connectives */}
        <section className="reference-section">
          <h2>1. {t('referencePage.section1Title')}</h2>
          
          <div className="reference-item">
            <h3>{t('referencePage.not')}</h3>
            <table className="truth-table">
              <thead>
                <tr>
                  <th>P</th>
                  <th>¬P</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>T</td>
                  <td>F</td>
                </tr>
                <tr>
                  <td>F</td>
                  <td>T</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="reference-item">
            <h3>{t('referencePage.and')}</h3>
            <table className="truth-table">
              <thead>
                <tr>
                  <th>P</th>
                  <th>Q</th>
                  <th>P ∧ Q</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>T</td>
                  <td>T</td>
                  <td><strong>T</strong></td>
                </tr>
                <tr>
                  <td>T</td>
                  <td>F</td>
                  <td>F</td>
                </tr>
                <tr>
                  <td>F</td>
                  <td>T</td>
                  <td>F</td>
                </tr>
                <tr>
                  <td>F</td>
                  <td>F</td>
                  <td>F</td>
                </tr>
              </tbody>
            </table>
            <p className="note">✓ {t('referencePage.andNote')}</p>
          </div>

          <div className="reference-item">
            <h3>{t('referencePage.or')}</h3>
            <table className="truth-table">
              <thead>
                <tr>
                  <th>P</th>
                  <th>Q</th>
                  <th>P ∨ Q</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>T</td>
                  <td>T</td>
                  <td><strong>T</strong></td>
                </tr>
                <tr>
                  <td>T</td>
                  <td>F</td>
                  <td><strong>T</strong></td>
                </tr>
                <tr>
                  <td>F</td>
                  <td>T</td>
                  <td><strong>T</strong></td>
                </tr>
                <tr>
                  <td>F</td>
                  <td>F</td>
                  <td>F</td>
                </tr>
              </tbody>
            </table>
            <p className="note">✓ {t('referencePage.orNote')}</p>
          </div>

          <div className="reference-item">
            <h3>{t('referencePage.implies')}</h3>
            <table className="truth-table">
              <thead>
                <tr>
                  <th>P</th>
                  <th>Q</th>
                  <th>P → Q</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>T</td>
                  <td>T</td>
                  <td><strong>T</strong></td>
                </tr>
                <tr>
                  <td>T</td>
                  <td>F</td>
                  <td><strong>F</strong></td>
                </tr>
                <tr>
                  <td>F</td>
                  <td>T</td>
                  <td><strong>T</strong></td>
                </tr>
                <tr>
                  <td>F</td>
                  <td>F</td>
                  <td><strong>T</strong></td>
                </tr>
              </tbody>
            </table>
            <p className="note">✗ {t('referencePage.impliesNote')}</p>
          </div>

          <div className="reference-item">
            <h3>{t('referencePage.iff')}</h3>
            <table className="truth-table">
              <thead>
                <tr>
                  <th>P</th>
                  <th>Q</th>
                  <th>P ↔ Q</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>T</td>
                  <td>T</td>
                  <td><strong>T</strong></td>
                </tr>
                <tr>
                  <td>T</td>
                  <td>F</td>
                  <td>F</td>
                </tr>
                <tr>
                  <td>F</td>
                  <td>T</td>
                  <td>F</td>
                </tr>
                <tr>
                  <td>F</td>
                  <td>F</td>
                  <td><strong>T</strong></td>
                </tr>
              </tbody>
            </table>
            <p className="note">✓ {t('referencePage.iffNote')}</p>
          </div>
        </section>

        {/* Laws */}
        <section className="reference-section">
          <h2>2. {t('referencePage.section2Title')}</h2>

          <div className="reference-item">
            <h3>{t('referencePage.deMorgans')}</h3>
            <div className="law-box">
              <p>¬(P ∧ Q) ≡ ¬P ∨ ¬Q</p>
            </div>
            <div className="law-box">
              <p>¬(P ∨ Q) ≡ ¬P ∧ ¬Q</p>
            </div>
          </div>

          <div className="reference-item">
            <h3>{t('referencePage.doubleNegation')}</h3>
            <div className="law-box">
              <p>¬(¬P) ≡ P</p>
            </div>
          </div>

          <div className="reference-item">
            <h3>{t('referencePage.lawOfContradiction')}</h3>
            <div className="law-box">
              <p>¬(P ∧ ¬P) — {t('referencePage.alwaysFalse')}</p>
            </div>
          </div>

          <div className="reference-item">
            <h3>{t('referencePage.lawOfExcludedMiddle')}</h3>
            <div className="law-box">
              <p>P ∨ ¬P — {t('referencePage.alwaysTrue')} ({t('referencePage.tautology')})</p>
            </div>
          </div>

          <div className="reference-item">
            <h3>{t('referencePage.implyEquivalent')}</h3>
            <div className="law-box">
              <p>P → Q ≡ ¬P ∨ Q</p>
            </div>
          </div>

          <div className="reference-item">
            <h3>{t('referencePage.distributive')}</h3>
            <div className="law-box">
              <p>P ∧ (Q ∨ R) ≡ (P ∧ Q) ∨ (P ∧ R)</p>
            </div>
            <div className="law-box">
              <p>P ∨ (Q ∧ R) ≡ (P ∨ Q) ∧ (P ∨ R)</p>
            </div>
          </div>

          <div className="reference-item">
            <h3>{t('referencePage.commutative')}</h3>
            <div className="law-box">
              <p>P ∧ Q ≡ Q ∧ P</p>
            </div>
            <div className="law-box">
              <p>P ∨ Q ≡ Q ∨ P</p>
            </div>
          </div>

          <div className="reference-item">
            <h3>{t('referencePage.associative')}</h3>
            <div className="law-box">
              <p>(P ∧ Q) ∧ R ≡ P ∧ (Q ∧ R)</p>
            </div>
            <div className="law-box">
              <p>(P ∨ Q) ∨ R ≡ P ∨ (Q ∨ R)</p>
            </div>
          </div>
        </section>

        {/* Operator Priority */}
        <section className="reference-section">
          <h2>3. {t('referencePage.section3Title')}</h2>
          
          <div className="priority-list">
            <div className="priority-item">
              <span className="priority-rank">1</span>
              <span className="priority-op">¬</span>
              <span className="priority-desc">{t('referencePage.highestPriority')}</span>
            </div>
            <div className="priority-item">
              <span className="priority-rank">2</span>
              <span className="priority-op">∧</span>
              <span className="priority-desc"></span>
            </div>
            <div className="priority-item">
              <span className="priority-rank">3</span>
              <span className="priority-op">∨</span>
              <span className="priority-desc"></span>
            </div>
            <div className="priority-item">
              <span className="priority-rank">4</span>
              <span className="priority-op">→</span>
              <span className="priority-desc"></span>
            </div>
            <div className="priority-item">
              <span className="priority-rank">5</span>
              <span className="priority-op">↔</span>
              <span className="priority-desc">{t('referencePage.lowestPriority')}</span>
            </div>
          </div>

          <p className="example">
            <strong>{t('referencePage.example')}:</strong> ¬P ∧ Q → R ≡ ((¬P) ∧ Q) → R
          </p>
        </section>

        {/* Quick Tips */}
        <section className="reference-section">
          <h2>4. {t('referencePage.section4Title')}</h2>
          
          <div className="tips-box">
            <div className="tip">
              <h4>📌 {t('referencePage.tip1Title')}</h4>
              <p>{t('referencePage.tip1Desc')}</p>
            </div>
            <div className="tip">
              <h4>📌 {t('referencePage.tip2Title')}</h4>
              <p>{t('referencePage.tip2Desc')}</p>
            </div>
            <div className="tip">
              <h4>📌 {t('referencePage.tip3Title')}</h4>
              <p>{t('referencePage.tip3Desc')}</p>
            </div>
            <div className="tip">
              <h4>📌 {t('referencePage.tip4Title')}</h4>
              <p>{t('referencePage.tip4Desc')}</p>
            </div>
            <div className="tip">
              <h4>📌 {t('referencePage.tip5Title')}</h4>
              <p>{t('referencePage.tip5Desc')}</p>
            </div>
            <div className="tip">
              <h4>📌 {t('referencePage.tip6Title')}</h4>
              <p>{t('referencePage.tip6Desc')}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ReferencePage;
