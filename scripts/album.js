
var createSongRow = function(songNumber, songName, songLength) {
    var template =
        ' <tr class="album-view-song-item">' +
        ' <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>' +
        ' <td class="song-item-title">' + songName + '</td>' +
        ' <td class="song-item-duration">' + filterTimeCode(songLength) + '</td>' +
        '</tr>'
    ;

    var $row = $(template);

    var clickHandler = function() {

        var songNumber = parseInt($(this).attr("data-song-number"));

        if (currentlyPlayingSongNumber !== null) {
            var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
            currentlyPlayingCell.html(currentlyPlayingSongNumber);
        }
        if (currentlyPlayingSongNumber !== songNumber) {
            $(this).html(pauseButtonTemplate);
            setSong((songNumber));
            currentSoundFile.play();
            $(".seek-bar .fill").css("width", currentVolume);
            $(".seek-bar .thumb").css("left", currentVolume);
            updatePlayerBarSong();
            updateSeekBarWhileSongPlays();
        } else if (currentlyPlayingSongNumber === songNumber) {
            if (currentSoundFile.isPaused()){
                $(this).html(pauseButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPauseButton);
                currentSoundFile.play();
            } else {
                currentSoundFile.pause();
                $(this).html(playButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPlayButton);
            }
        }
    };

    var onHover = function(event) {

        var songNumberCell = $(this).find('.song-item-number');
        var songNum = parseInt(songNumberCell.attr('data-song-number'));

        if (songNum !== currentlyPlayingSongNumber)  {
            songNumberCell.html(playButtonTemplate);
        }
    };

    var offHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNum = parseInt(songNumberCell.attr('data-song-number'));
        if (songNum !== currentlyPlayingSongNumber) {
            songNumberCell.html(songNum);
        }
    };

    $row.find('.song-item-number').click(clickHandler);
    $row.hover(onHover, offHover);
    return $row;
};

var setCurrentAlbum = function(album) {
    currentAlbum = album;
    var $albumTitle = $('.album-view-title');
    var $albumArtist = $('.album-view-artist');
    var $albumReleaseInfo = $('.album-view-release-info');
    var $albumImage = $('.album-cover-art');
    var $albumSongList = $('.album-view-song-list');

    $albumTitle.text(album.title);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);

    $albumSongList.empty();

    for (var i=0; i<album.songs.length; i++){
        var $newRow = createSongRow(i+1, album.songs[i].title, album.songs[i].duration);
        $albumSongList.append($newRow);
    }
};

var trackIndex = function(album, song) {
  return album.songs.indexOf(song);
};

var nextSong = function() {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    var previousPlayingSongNumber = currentlyPlayingSongNumber;
    currentSongIndex++;

    if (currentSongIndex >= currentAlbum.songs.length){
        currentSongIndex = 0;
    }
    setSong(currentSongIndex);
    currentSoundFile.play();
    updatePlayerBarSong();
    updateSeekBarWhileSongPlays();
    getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate);
    getSongNumberCell(previousPlayingSongNumber).html(previousPlayingSongNumber);
};

var previousSong = function() {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    var nextPlayingSongNumber = currentlyPlayingSongNumber;
    currentSongIndex--;
        if (currentSongIndex < 0) {
    currentSongIndex = currentAlbum.songs.length - 1;
    }
    setSong(currentSongIndex);
    currentSoundFile.play();
    updatePlayerBarSong();
    updateSeekBarWhileSongPlays();
    getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate);
getSongNumberCell(nextPlayingSongNumber).html(nextPlayingSongNumber);
};

var updatePlayerBarSong = function() {
  $('.currently-playing .song-name').text(currentAlbum.songs[(currentlyPlayingSongNumber -1)].title);
  $('.currently-playing .artist-name').text(currentAlbum.artist);
  $('.currently-playing .artist-song-mobile').text([currentAlbum.songs[(currentlyPlayingSongNumber -1)].title + " - " + currentAlbum.artist]);
  $('.main-controls .play-pause').html(playerBarPauseButton);
  setTotalTimeInPlayerBar(currentAlbum.songs[(currentlyPlayingSongNumber - 1)].duration);

}


var setSong = function (songNumber) {
    if (currentSoundFile) {
        currentSoundFile.stop();
    }
    currentlyPlayingSongNumber = songNumber;
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
        formats: ['mp3'],
        preload: true
    });
    setVolume(currentVolume);
};

var getSongNumberCell = function (number) {
    return $('.song-item-number[data-song-number="' + number + '"]');
};

var seek = function(time) {
    if (currentSoundFile) {
        currentSoundFile.setTime(time);
    }
}

var setVolume = function (volume) {
    if (currentSoundFile) {
        currentSoundFile.setVolume(volume);
    }
};

var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
    var offsetXPercent = seekBarFillRatio * 100;
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);
    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
};



var setupSeekBars = function() {
    var $seekBars = $('.player-bar .seek-bar');
    
    $seekBars.click(function(event){
        var offsetX = event.pageX - $(this).offset().left;
        var barWidth = $(this).width();
        var seekBarFillRatio = offsetX / barWidth;
        var seekBarParent = $(this).parent();
        if ($(seekBarParent).hasClass("seek-control")) {
            seek(currentSoundFile.getDuration() * seekBarFillRatio);
        } else {
            setVolume(Math.round(seekBarFillRatio * 100));
        }
    
        updateSeekPercentage($(this), seekBarFillRatio);
    });
    $seekBars.find('.thumb').mousedown(function(event){
        var $seekBar = $(this).parent();
        $(document).bind('mousemove.thumb', function(event){
            var offsetX = event.pageX - $seekBar.offset().left;
            var barWidth = $seekBar.width();
            var seekBarFillRatio = offsetX / barWidth;
            if ($(".seek-control")) {
                seek(currentSoundFile.getDuration() * seekBarFillRatio);
            } else {
                setVolume(Math.round(seekBarFillRatio * 100));
            }
            
            updateSeekPercentage($seekBar, seekBarFillRatio);
        });
        $(document).bind('mouseup.thumb', function () {
            $(document).unbind('mousemove.thumb');
            $(document).unbind('mouseup.thumb');
        });
    });
};

var updateSeekBarWhileSongPlays = function() {
    if (currentSoundFile) {
        currentSoundFile.bind('timeupdate', function(event){
            var seekBarFillRatio = this.getTime() / this.getDuration();
            var $seekBar = $('.seek-control .seek-bar');
            
            updateSeekPercentage($seekBar, seekBarFillRatio);
            setCurrentTimeInPlayerBar(this.getTime());
        });
    }
};

var setCurrentTimeInPlayerBar = function (currentTime) {
    $('.currently-playing .current-time').text(filterTimeCode(currentTime));
};

var setTotalTimeInPlayerBar = function(totalTime) {
  var testTime = currentSoundFile.getDuration();
  $('.currently-playing .total-time').text(filterTimeCode(totalTime));
};

var filterTimeCode = function(timeInSeconds) {
    var minutes = null;
    var seconds = null;
    timeInSeconds = Math.floor(parseFloat(timeInSeconds));
    minutes = Math.floor(timeInSeconds/60);
    seconds = Math.floor(timeInSeconds%60);
    return (minutes + ':' + ((seconds < 10) ? + "0" + seconds.toString() : seconds)).toString();    
    
};

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentlyPlayingSongNumber = null;
var currentAlbum = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;
var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

$(document).ready( function() {
    setCurrentAlbum(albumPicasso);
    setupSeekBars();
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
});
