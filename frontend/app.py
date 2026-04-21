import streamlit as st
import requests

API = "http://127.0.0.1:8000"

st.set_page_config(page_title="NewsFusion", layout="wide")

# ---------------- CUSTOM CSS ----------------
st.markdown("""
<style>
body {
    background-color: #0e1117;
}
.card {
    background-color: #1c1f26;
    padding: 15px;
    border-radius: 15px;
    margin-bottom: 15px;
    box-shadow: 0px 4px 10px rgba(0,0,0,0.3);
}
.title {
    font-size: 18px;
    font-weight: bold;
}
.summary {
    font-size: 14px;
    color: #cfcfcf;
}
</style>
""", unsafe_allow_html=True)

# ---------------- HEADER ----------------
st.title("📰 NewsFusion")
st.caption("Hybrid AI-Powered News Recommendation System")

# ---------------- SIDEBAR ----------------
st.sidebar.header("⚙️ Controls")

user = st.sidebar.text_input("User ID", "anand")
base = st.sidebar.number_input("Base Article ID", min_value=0, step=1)

get_feed = st.sidebar.button("🚀 Get Recommendations")

# ---------------- MAIN ----------------
if get_feed:
    try:
        res = requests.get(f"{API}/recommend/{user}/{base}")
        articles = res.json()["data"]

        st.subheader("🎯 Personalized Feed")

        # GRID LAYOUT (2 columns)
        cols = st.columns(2)

        for i, art in enumerate(articles):
            with cols[i % 2]:

                st.markdown("<div class='card'>", unsafe_allow_html=True)

                st.markdown(f"<div class='title'>{art['title']}</div>", unsafe_allow_html=True)
                st.markdown(f"<div class='summary'>{art['ai_summary']}</div>", unsafe_allow_html=True)

                st.markdown(f"[🔗 Read full article]({art['link']})")

                col1, col2 = st.columns(2)

                # LIKE BUTTON
                if col1.button("❤️ Like", key=f"like_{i}"):
                    requests.post(
                        f"{API}/interact",
                        params={
                            "user_id": user,
                            "article_id": i,
                            "action": "like"
                        }
                    )
                    st.toast("Liked 👍")

                # VIEW BUTTON
                if col2.button("👀 View", key=f"view_{i}"):
                    requests.post(
                        f"{API}/interact",
                        params={
                            "user_id": user,
                            "article_id": i,
                            "action": "click"
                        }
                    )
                    st.toast("Viewed 👁️")

                st.markdown("</div>", unsafe_allow_html=True)

    except Exception as e:
        st.error(f"Error: {e}")

else:
    st.info("👉 Enter details and click 'Get Recommendations'")