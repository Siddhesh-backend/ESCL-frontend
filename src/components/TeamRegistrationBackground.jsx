
import './TeamRegistrationBackground.css'

export default function TeamRegistrationBackground() {
    return (
        <div className="team-stadium-bg" aria-hidden="true">
            <div className="stadium-glow stadium-glow-left" />
            <div className="stadium-glow stadium-glow-right" />

            <div className="stadium-lights lights-left">
                <span />
                <span />
                <span />
                <span />
            </div>

            <div className="stadium-lights lights-right">
                <span />
                <span />
                <span />
                <span />
            </div>

            <div className="stadium-stands">
                <div className="stadium-stand-line" />
                <div className="stadium-stand-line" />
                <div className="stadium-stand-line" />
            </div>

            <div className="stadium-field">
                <div className="stadium-boundary" />
                <div className="stadium-pitch" />
                <div className="stadium-pitch-line" />
            </div>

            <div className="stadium-ball">
                <span />
            </div>

            <div className="stadium-vignette" />
        </div>
    )
}
