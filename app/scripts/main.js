$(document).ready(function() {
	// put dom stuff here

  var myPostsString = _.template($("#postTmpl").html(), posts);
  var recentPostsString = _.template($("#recentPostsTmpl").html(), posts);

  $("section").append(myPostsString);
  $(".recentPosts").append(recentPostsString);

  $(".mainContent").on("click", "button", function() {

     $('#myModal').modal();

  });

  $("#newPostForm").on("submit", function(e) {
  		e.preventDefault();
  		// var formData = $(this).serializeArray();
  		// console.log($(this).serializeArray());
  		var postTitle = $(".newPostTitle").val();
  		var authorPostForm = $(".authorPostForm").val();
  		var postContentForm = $(".postContentForm").val();
  		console.log(postContentForm);

  		var newPostObj = {
  					title: postTitle,
  					date: "Tuesday, 29, 2014",
  					content: postContentForm,
  					author: authorPostForm
  		};
  		posts.unshift(newPostObj);
  		var myPostsString = _.template($("#postTmpl").html(), posts);

  		$(".newPostTitle").val("");
  		$(".authorPostForm").val("");
  		$(".postContentForm").val(""); 
  		$("#myModal").modal("hide");
  		$("section").html(myPostsString);


  });

  $(".mainContent").on("click", ".removePost", function() {
  		$(this).closest("article").remove();

  });


});

var mypage = {
			createTemplateString: function($template, data) {

				var tmpl = _.template($tmplate, data);
				return tmpl;
			},

			addTemplateToDom: function($el, tmplString) {
					$el.html(tmplString);

			}


};
