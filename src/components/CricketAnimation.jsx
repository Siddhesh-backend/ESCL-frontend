
import React from "react";
import "./CricketAnimation.css";

export default function CricketAnimation() {
    return (
        <div className="cricket-animation" aria-hidden="true">
            {/* Stadium lights */}
            <div className="stadium-light stadium-light-left" />
            <div className="stadium-light stadium-light-right" />

            {/* Cricket pitch */}
            <div className="cricket-pitch">
                <div className="pitch-line pitch-line-top" />
                <div className="pitch-line pitch-line-bottom" />

                {/* Stumps */}
                <div className="cricket-stumps">
                    <span />
                    <span />
                    <span />
                    <i />
                </div>
            </div>

            {/* Animated cricket ball */}
            <div className="cricket-ball-wrap">
                <div className="cricket-ball">
                    <span className="ball-seam" />
                </div>
                <div className="ball-trail" />
            </div>

            {/* Ground glow */}
            <div className="ground-glow" />
        </div>
    );
}
