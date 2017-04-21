
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
            currentlyPlayingSongNumber = songNumber;
            currentSongFromAlbum = currentAlbum.songs[songNumber-1];
            updatePlayerBarSong();
        } else if (currentlyPlayingSongNumber === songNumber) {
            if ($('.main-controls .play-pause').html() == playerBarPlayButton){
                $(this).html(pauseButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPauseButton);
            } else {
                $(this).html(playButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPlayButton);
            }
        }
    };

    var onHover = function(event) {

        var cell = $(this).find('.song-item-number');
        var songNum = parseInt(cell.attr('data-song-number'));

        if (songNum !== currentlyPlayingSongNumber)  {
            cell.html(playButtonTemplate);
        }
    };

    var offHover = function(event) {
        var cell = $(this).find('.song-item-number');
        var songNum = parseInt(cell.attr('data-song-number'));
        if (songNum !== currentlyPlayingSongNumber) {
            cell.html(songNum);
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
  currentlyPlayingSongNumber = currentSongIndex + 1;
  currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
  updatePlayerBarSong();

  var nextSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
  var lastSongNumberCell = $('.song-item-number[data-song-number="' + previousPlayingSongNumber + '"]');

  nextSongNumberCell.html(pauseButtonTemplate);
  lastSongNumberCell.html(previousPlayingSongNumber);
};

var previousSong = function() {
  var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
  var nextPlayingSongNumber = currentlyPlayingSongNumber;
  currentSongIndex--;
  if (currentSongIndex < 0) {
    currentSongIndex = currentAlbum.songs.length - 1;
  }
  currentlyPlayingSongNumber = currentSongIndex + 1;
  currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
  updatePlayerBarSong();

  var previousSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
  var lastSongNumberCell = $('.song-item-number[data-song-number="' + nextPlayingSongNumber + '"]');

  previousSongNumberCell.html(pauseButtonTemplate);
  lastSongNumberCell.html(nextPlayingSongNumber);
};

var updatePlayerBarSong = function() {
  $('.currently-playing .song-name').text(currentAlbum.songs[(currentlyPlayingSongNumber -1)].title);
  $('.currently-playing .artist-name').text(currentAlbum.artist);
  $('.currently-playing .artist-song-mobile').text([currentAlbum.songs[(currentlyPlayingSongNumber) -1].title + " - " + currentAlbum.artist]);
  $('.main-controls .play-pause').html(playerBarPauseButton);

}

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentlyPlayingSongNumber = null;
var currentAlbum = null;
var currentSongFromAlbum = null;
var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

$(document).ready( function() {
    setCurrentAlbum(albumPicasso);
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
});
