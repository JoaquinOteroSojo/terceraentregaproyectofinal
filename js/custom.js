var player = null;
jQuery(function ($) {
  $(document).ready(function (e) {
    start_video_js_player();

    $("#go_down_arrow").click(function (e) {
      var vent_alt = $(window).height();
      var scrollTop = $(window).scrollTop();

      $("html , body").animate(
        { scrollTop: scrollTop + vent_alt },
        800,
        "easeOutSine"
      );
    });

    // Video JS
    if ($("#player-wrapper").length > 0) {
      $(".work").click(function (e) {
        e.preventDefault();
        var current = $(this);
        var video_src = current.attr("data-src");

        if (video_src !== "") {
          if (!current.hasClass("current_video_playing")) {
            var url = $("#site-url").attr("data-url");
            $("#player-wrapper").fadeIn(500, "easeInOutCubic");
            var this_video_title = $(".title", current).text();
            var this_video_brand = $(".brand", current).text();
            $("#player-wrapper .player-info .player-video-title").text(
              this_video_title
            );
            $("#player-wrapper .player-info .player-video-brand").text(
              this_video_brand
            );

            player = videojs("player-video-custom");
            player.src({ type: "video/mp4", src: video_src });
            player.play();
            $("#player #player-video-custom video").css("display", "");

            $("#player-wrapper").removeClass("paused");
            $("#player-wrapper").addClass("playing");

            $("#player-wrapper").addClass("notLoading");
            $("#player-wrapper").removeClass("loading");
          } else {
            $("#player-wrapper").fadeIn(500, "easeInOutCubic", function () {
              videojs("player-video-custom").play();
            });
          }
        }
      });
    }
  });

  var timeout = null;

  $(document).on("mousemove", function () {
    if (timeout !== null) {
      $("#player-wrapper").removeClass("hide-elements");
      clearTimeout(timeout);
    }

    timeout = setTimeout(function () {
      $("#player-wrapper").addClass("hide-elements");
    }, 3000);
  });

  function start_video_js_player() {
    if ($("#player-wrapper").length > 0) {
      player = videojs("player-video-custom");

      player.ready(function () {
        $(".player-controls .play").click(function () {
          var isPaused = player.paused();
          if (isPaused) {
            player.play();
          }
        });

        $(".player-controls .pause").click(function () {
          var isPaused = player.paused();
          if (!isPaused) {
            player.pause();
          }
        });

        $(".player-click-sector").click(function () {
          var isPaused = player.paused();
          if (isPaused) {
            player.play();
          } else {
            player.pause();
          }
        });

        $(".player-controls .full").click(function () {
          $("#player-wrapper").removeClass("notFull");
          player.requestFullscreen();
        });

        $(".btn.close").click(function () {
          player.pause();
          $("#player-wrapper").fadeOut(500, "easeInOutCubic", function () {
            $(".player-video-title").text("");
            $(".player-video-brand").text("");
            $(".player-video-place").text("");
          });
          //$("main").removeClass('closed');
        });

        player.on("progress", function () {
          bufferedTimeRange = player.buffered();
          firstRangeStart = bufferedTimeRange.start(0);
          firstRangeEnd = bufferedTimeRange.end(0);
          firstRangeLength = firstRangeEnd - firstRangeStart;
          var totalTime = player.duration();
          var bufferPorc = (firstRangeLength * 100) / totalTime;
          $(".timeline .buffer").css("width", bufferPorc + "%");
        });

        player.on("play", function () {
          trackPlayProgress();
          $("#player-wrapper").removeClass("paused");
          $("#player-wrapper").addClass("playing");
          $("#player-wrapper").addClass("alrdy_played");
          $(".player-controls .play").addClass("hidden");
          $(".player-controls .pause").removeClass("hidden");

          if ($(window).width() > $(window).height()) {
            if ($("#content-wrapper").hasClass("home")) {
              player_to_full(true);
            }
          }
        });

        player.on("pause", function () {
          stopTrackingPlayProgress();
          $("#player-wrapper").addClass("paused");
          $("#player-wrapper").removeClass("playing");
          $(".player-controls .play").removeClass("hidden");
          $(".player-controls .pause").addClass("hidden");

          if ($("#content-wrapper").hasClass("home")) {
            var pant_ancho = $(window).width();
            if ($("#player-wrapper").hasClass("paused")) {
              player_to_small();
            } else {
              player_to_full(false);
            }
          }
        });

        player.on("ended", function () {
          $("#player-wrapper").removeClass("alrdy_played");
          player.pause();
          $("#player-wrapper").fadeOut(500, "easeInOutCubic");
        });

        $("body").keydown(function (e) {
          if (e.keyCode == 32) {
            e.preventDefault();
            var isPaused = player.paused();
            if (isPaused) {
              player.play();
              $("#player-wrapper").removeClass("paused");
              $("#player-wrapper").addClass("playing");
            } else {
              player.pause();
              $("#player-wrapper").addClass("paused");
              $("#player-wrapper").removeClass("playing");
            }
            return false;
          }
        });

        $(".timeline").click(function (event) {
          var current = $(this);
          var mouseX = event.pageX;
          var margin = parseInt(current.offset().left);
          var max_ancho = current.width();
          var pos_porc = ((mouseX - margin) * 100) / max_ancho;

          var duracion = player.duration();

          var current_time = (pos_porc * duracion) / 100;
          player.currentTime(current_time);

          var timePorc = (player.currentTime() * 100) / player.duration();
          $(".progress", current).css("width", timePorc + "%");
        });

        function trackPlayProgress() {
          playProgressInterval = setInterval(updatePlayProgress, 33);
        }

        function stopTrackingPlayProgress() {
          clearInterval(playProgressInterval);
        }

        function updatePlayProgress() {
          var timePorc = (player.currentTime() * 100) / player.duration();
          $(".timeline .progress").css("width", timePorc + "%");
        }
      });
    }
  }
});
