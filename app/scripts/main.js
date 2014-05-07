$(document).ready(function() {
	
  myBlog.init();

});

var myBlog = {
  init: function() {
    this.initStyling();
    this.initEvents();
  },
  initStyling: function() {
    
    this.renderPosts();
    this.renderSideBar();

  },
  initEvents: function() {

    $(".mainContent").on("click", "button", function() {
      $("#myModal").modal();
    });

    $(".mainContent").on("click", ".editPost", function(e) {
      e.preventDefault();
      var postId = $(this).closest("article").data("postid");
      myBlog.renderModalPostDetail(postId);
      $("#editPostModal").modal();
    });
    $("#editPostModal").on("click", ".submitUpdatePost", function(e) {
        var postId = $("#editPostId").val();
       myBlog.updatePost(postId);
    });

    $(".mainContent").on("click", ".removePost", this.removePost);

    $("#newPostForm").on("submit", this.addPost);

  },
  render: function($el, template, data) {
      var tmpl = _.template(template, data);

      $el.html(tmpl);

  },
  renderPosts: function() {

    $.ajax({
      url: "http://tiy-fee-rest.herokuapp.com/collections/myBlog",
      type: "GET",
      dataType: "json",
      error: function(jqXHR, status, error) {
        alert("you broke the internet");
      },
      success: function(data, dataType, jqXHR) {
        
        var posts = window.posts = data; // have to make global for underscore to work
        myBlog.render($("section"), Templates.post, posts);
         

      }
    });

  },
  renderSideBar: function() {
    $.ajax({
      url:"http://tiy-fee-rest.herokuapp.com/collections/myBlog",
      type: "GET",
      error: function(jqXHR, status, error) {
        alert("error rendering sidebar: " + error);
      },
      success: function(data) {
        var titles = window.titles = _.pluck(data, "title");
        myBlog.render($(".recentPosts"), Templates.sidebarPosts, titles);
      }
    });
  },
  addPost: function(e) {
    e.preventDefault();

        var newPost = {
              title: $(".newPostTitle").val(),
              date: new Date(),
              content: myBlog.encodeToString($(".postContentForm").val()),
              author: $(".authorPostForm").val()
        };
    $.ajax({
      url: "http://tiy-fee-rest.herokuapp.com/collections/myBlog",
      type: "POST",
      data: newPost, 
      dataType: "json",
      error: function(jqXHR, status, error) {
        alert("couldn't add post");
      },
      success: function(data, dataType, jqXHR) {
        $(".newPostTitle").val("");
        $(".authorPostForm").val("");
        $(".postContentForm").val(""); 
        $("#myModal").modal("hide");
        myBlog.renderPosts();  
        myBlog.renderSideBar();
      }
    });

  },
  removePost: function() {
    var $thisPost = $(this).closest("article")
    var postId = $thisPost.data("postid");
    $.ajax({
      url: "http://tiy-fee-rest.herokuapp.com/collections/myBlog/" + postId,
      type: "DELETE",
      error: function(jqXHR, status, error) {
        alert("couldnt delete");
      }, 
      success: function(data) {
         myBlog.renderPosts();  
         myBlog.renderSideBar();
      }
    });
  },
  updatePost: function(postId) {
     console.log("work in update method");
     var id = postId;
        var editPost = {
              title: $(".editPostTitle").val(),
              date: new Date(),
              content: this.encodeToString($(".editContentForm").val()),
              author: $(".editAuthorPostForm").val()
        };
    $.ajax({
      url: "http://tiy-fee-rest.herokuapp.com/collections/myBlog/" + id,
      type: "PUT",
      data: editPost, 
      error: function(jqXHR, status, error) {
        alert("couldn't add post: " + error);
      },
      success: function(data, dataType, jqXHR) {
        console.log("in edit post");
        $("#editPostModal").modal("hide");
        myBlog.renderPosts();  
        myBlog.renderSideBar();
      }
    });

  },
  renderModalPostDetail: function(postId) {

    $.ajax({
      url: "http://tiy-fee-rest.herokuapp.com/collections/myBlog/" + postId,
      type: "GET",
      dataType: "json",
      error: function(jqXHR, status, error) {
        alert("render post detail is broken");
      },
      success: function(data, dataType, jqXHR) {
        
        var post = window.post = data; // have to make global for underscore to work
        myBlog.render($("#editPostForm"),Templates.editModal, post);

      }
    });

  },
  encodeToString: function(str) {
    return str.replace(/[&<>"']/g, function($0) {
        return "&" + {"&":"amp", "<":"lt", ">":"gt", '"':"quot", "'":"#39"}[$0] + ";";
    });
}

};