function buildPostsHTML(arr, string) {
  const postsWrapper = document.createElement("div");
  postsWrapper.classList.add(`posts__wrapper`, string);
  arr.forEach((item) => {
    const post = document.createElement("div");
    post.innerHTML = item.excerpt.rendered;
    const title = document.createElement("h3");
    title.textContent = item.title.rendered;
    post.prepend(title);
    postsWrapper.append(post);
  });
  document.querySelector("#content-wrapper").append(postsWrapper);
}
function setInitialActiveContent() {
  document.querySelectorAll(".posts__wrapper").forEach((postsWrapper) => {
    if (postsWrapper.classList.contains("uncategorized")) {
      postsWrapper.classList.add("active");
    }
  });
}
function addTabsFunctionality(arr) {
  document.querySelectorAll(".tabs__wrapper nav button").forEach((button) => {
    button.addEventListener("click", () => {
      button.classList.remove("active");
      arr.forEach((item) => {
        const classListArr = [...item.classList];
        const filtered = classListArr.filter((classItem) => {
          if (
            classItem === button.textContent.toLowerCase().replaceAll(" ", "-")
          ) {
            return classItem;
          }
        });
        if (filtered.length > 0) {
          arr.forEach((post) => {
            post.classList.remove("active");
          });
          item.classList.add("active");
          document.querySelectorAll(".tabs__wrapper nav button").forEach((buttonItem) => {
            buttonItem.classList.remove("active");
          });
          button.classList.add("active");
        }
      });
    });
  });
}

async function getData() {
  const url = "http://localhost:10018/wp-json/wp/v2/posts";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    const writableJson = [...json];
    writableJson.forEach((obj) => {
      obj.category = null;
      obj.class_list.forEach((string) => {
        if (string.includes("category") && !string.includes("test")) {
          obj.category = string;
        }
      });
    });
    const uncategorized = writableJson.filter((post) => {
      if (post.category.includes("uncategorized")) {
        return post;
      }
    });
    const learningSideQuests = writableJson.filter((post) => {
      if (post.category.includes("learning-side-quests")) {
        return post;
      }
    });
    const learningRecaps = writableJson.filter((post) => {
      if (post.category.includes("learning-recap")) {
        return post;
      }
    });
    buildPostsHTML(uncategorized, "uncategorized");
    buildPostsHTML(learningRecaps, "learning-recap");
    buildPostsHTML(learningSideQuests, "learning-side-quests");
    const postWrappers = document.querySelectorAll(".posts__wrapper");
    addTabsFunctionality(postWrappers);
  } catch (error) {
    console.error(error.message);
  }
  setInitialActiveContent();
}
getData();
