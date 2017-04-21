
var createSongRow = function(songNumber, songName, songLength) {
    var template =
        ' <tr class="album-view-song-item">' +
        ' <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>' +
        ' <td class="song-item-title">' + songName + '</td>' +
        ' <td class="song-item-duration">' + songLength + '</td>' +
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
            setSong((songNumber-1));
            currentSoundFile.play();
            updatePlayerBarSong();
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

    getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate);
getSongNumberCell(nextPlayingSongNumber).html(nextPlayingSongNumber);
};

var updatePlayerBarSong = function() {
  $('.currently-playing .song-name').text(currentAlbum.songs[(currentlyPlayingSongNumber -1)].title);
  $('.currently-playing .artist-name').text(currentAlbum.artist);
  $('.currently-playing .artist-song-mobile').text([currentAlbum.songs[(currentlyPlayingSongNumber) -1].title + " - " + currentAlbum.artist]);
  $('.main-controls .play-pause').html(playerBarPauseButton);

}

//Assignment 19 below


var setSong = function (songNumber) {
    if (currentSoundFile) {
        currentSoundFile.stop();
    }
    currentlyPlayingSongNumber = songNumber + 1;
    currentSongFromAlbum = currentAlbum.songs[songNumber];
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
        formats: ['mp3'],
        preload: true
    });
    setVolume(currentVolume);
};

var getSongNumberCell = function (number) {
    return $('.song-item-number[data-song-number="' + number + '"]');
};

var setVolume = function (volume) {
    if (currentSoundFile) {
        currentSoundFile.setVolume(volume);
    }
};

var togglePlayFromPlayerBar = function () {
/*  First option, boring if/else 8 lines of code  

    if (currentSoundFile.isPaused()){
        $('.main-controls .play-pause').html(playerBarPauseButton);
        getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate);
    } else {
        $('.main-controls .play-pause').html(playerBarPlayButton);
        getSongNumberCell(currentlyPlayingSongNumber).html(playButtonTemplate);
    }
    currentSoundFile.togglePlay();*/

// Second option 3 lines of code  toggle-toggle-toggle
    
    currentSoundFile.togglePlay();
    $(".main-controls .play-pause span").toggleClass("ion-pause").toggleClass("ion-play");
    $(".album-song-button span").toggleClass("ion-pause").toggleClass("ion-play");
}

// extra Credit

/*var shiftSong = function () {
    var direction = -1;
    if ($(this).hasClass("next")) {direction = 1;}
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    var newPlayingSongNumber = currentlyPlayingSongNumber;
    currentSongIndex = currentSongIndex + direction;
    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length - 1;
    } else if (currentSongIndex >= currentAlbum.songs.length){
        currentSongIndex = 0;
    }
    setSong(currentSongIndex);
    updatePlayerBarSong();

    getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate);
    getSongNumberCell(newPlayingSongNumber).html(newPlayingSongNumber);
    
    
};*/

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
var $playPauseButton = $('.main-controls .play-pause');

$(document).ready( function() {
    setCurrentAlbum(albumPicasso);
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
    $playPauseButton.click(togglePlayFromPlayerBar);
});
