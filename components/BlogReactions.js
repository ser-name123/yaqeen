"use client";

import { useState, useEffect } from "react";
import "./BlogReactions.css";

const DEFAULT_REACTIONS = [
  { id: "loved", emoji: "❤️", label: "Loved it", defaultCount: 49 },
  { id: "alhamdulillah", emoji: "🤲", label: "Alhamdulillah", defaultCount: 90 },
  { id: "insightful", emoji: "💡", label: "Insightful", defaultCount: 34 },
  { id: "applause", emoji: "👏", label: "Applause", defaultCount: 52 },
];

export default function BlogReactions({ slug = "default", initialCounts = null }) {
  const [counts, setCounts] = useState(() => {
    const initial = {};
    DEFAULT_REACTIONS.forEach((r) => {
      initial[r.id] = (initialCounts && initialCounts[r.id] !== undefined) ? initialCounts[r.id] : r.defaultCount;
    });
    return initial;
  });

  const [userSelected, setUserSelected] = useState({});
  const [activeAnim, setActiveAnim] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState("");

  // Load user saved reactions for this blog post from localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && slug) {
      try {
        const savedSelections = localStorage.getItem(`blog_reaction_selected_${slug}`);
        if (savedSelections) {
          setUserSelected(JSON.parse(savedSelections));
        }

        const savedCounts = localStorage.getItem(`blog_reaction_counts_${slug}`);
        if (savedCounts) {
          setCounts(JSON.parse(savedCounts));
        }
      } catch (err) {
        console.warn("Could not read reactions from storage:", err);
      }
    }
  }, [slug]);

  const handleReactionClick = (id) => {
    const isCurrentlySelected = !!userSelected[id];
    const newSelected = {
      ...userSelected,
      [id]: !isCurrentlySelected,
    };

    const newCounts = {
      ...counts,
      [id]: Math.max(0, (counts[id] || 0) + (isCurrentlySelected ? -1 : 1)),
    };

    setUserSelected(newSelected);
    setCounts(newCounts);
    setActiveAnim(id);

    if (!isCurrentlySelected) {
      setFeedbackMsg("JazakAllah Khair for your feedback! ✨");
    } else {
      setFeedbackMsg("");
    }

    // Clear animated effect after 600ms
    setTimeout(() => {
      setActiveAnim(null);
    }, 600);

    // Save to localStorage
    if (typeof window !== "undefined" && slug) {
      try {
        localStorage.setItem(`blog_reaction_selected_${slug}`, JSON.stringify(newSelected));
        localStorage.setItem(`blog_reaction_counts_${slug}`, JSON.stringify(newCounts));
      } catch (err) {
        console.warn("Could not persist reactions:", err);
      }
    }
  };

  return (
    <div className="blog-reactions-card reveal-slide-up">
      <div className="blog-reactions-content">
        <h3 className="blog-reactions-title">Did you find this article beneficial?</h3>
        <p className="blog-reactions-subtitle">
          Leave a reaction to let our scholars and editorial team know!
        </p>

        <div className="blog-reactions-buttons">
          {DEFAULT_REACTIONS.map((item) => {
            const isSelected = !!userSelected[item.id];
            const isAnimating = activeAnim === item.id;
            const count = counts[item.id] !== undefined ? counts[item.id] : item.defaultCount;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleReactionClick(item.id)}
                className={`blog-reaction-btn ${isSelected ? "selected" : "unselected"} ${
                  isAnimating ? "animate-pop" : ""
                }`}
                aria-label={`${item.label} (${count})`}
              >
                <span className="reaction-emoji">{item.emoji}</span>
                <span className="reaction-text">
                  {item.label} <span className="reaction-count">({count})</span>
                </span>
              </button>
            );
          })}
        </div>

        {feedbackMsg && (
          <div className="blog-reaction-toast">
            {feedbackMsg}
          </div>
        )}
      </div>
    </div>
  );
}
