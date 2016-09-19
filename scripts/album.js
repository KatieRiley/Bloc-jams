var createSongRow = function(songNumber, songName, songLength) {
    var template =
    '<tr class="album-view-song-item">'
    + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
    + '  <td class="song-item-title">' + songName + '</td>'
    + '  <td class="song-item-duration">' + songLength + '</td>'
    + '</tr>'
    ;

    var $row = $(template);
    
    var clickHandler = function() {
        var songNumber = $(this).attr('data-song-number');
        
        if (currentlyPlayingSongNumber !== null) {
            var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber +'"]');
            currentlyPlayingCell.html(currentlyPlayingSongNumber);
        }
        if (currentlyPlayingSongNumber !== songNumber) {
            $(this).html(pauseButtonTemplate);
            setSong(songNumber);
            //currentlyPlayingSongNumber = songNumber;
            //currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
            updatePlayerBarSong();
        } else if (currentlyPlayingSongNumber === songNumber) {
            $(this).html(playButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPlayButton);
            currentlyPlayingSongNumber = null;
            currentSongFromAlbum = null;
        }
    };
    
    var onHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));
        
        if(songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(playButtonTemplate);
        }
    };
    
    var offHover = function(event) {
        var songNumberCell = $(this).find('song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));
        
        if (songNumber !== currentlyPlayingSongNumber){
            songNumberCell.html(songNumber);
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
     $albumReleaseInfo.text(album.year + " " + album.label);
     $albumImage.attr('src', album.albumArtUrl);
 
     $albumSongList.empty();
     
     for (var i = 0; i < album.songs.length; i++) {
         var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
         $albumSongList.append($newRow);
     }
 };

var trackIndex = function(album, song){
    return album.songs.indexOf(song);  
};

var nextSong = function() {
    
    var lastSongIndex = function(index) {
        return index == 0 ? currentAlbum.songs.length : index;
    }
    
    var currSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currSongIndex++;
    
    if (currSongIndex >= currentAlbum.songs.length) {
        currSongIndex = 0;
    }
    var currSongNum = currSongIndex + 1;
    setSong(currSongNum);
    //currentlyPlayingSongNumber = currSongIndex + 1;
    //currentSongFromAlbum = currentAlbum.songs[currSongIndex];
    
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.title);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    
    var lastSongNum = lastSongIndex(currSongIndex);
    //var $nextSongNumCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    //var $lastSongNumCell = $('.song-item-number[data-song-number="' + lastSongNum + '"]');
    var $nextSongNumCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumCell = getSongNumberCell(lastSongNum);
    
    $nextSongNumCell.html(pauseButtonTemplate);
    $lastSongNumCell.html(lastSongNum);
};

var previousSong = function() {
    var getLastSongNum = function(index) {
        return index == (currentAlbum.song.length - 1) ? 1 : index + 2;
    };
    
    var currSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currSongIndex--;
    
    if (currSongIndex < 0) {
        currSongIndex = currentAlbum.songs.length - 1;
    }
    
    var currSongNum = currSongIndex + 1;
    setSong(currSongNum);
    //currentlyPlayingSongNumber = currSongIndex + 1;
    //currentSongFromAlbum - currentAlbum.songs[currSongIndex];
    
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.title);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    
    var lastSongNum = getLastSongNum(currSongIndex);
    //var $previousSongNumCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    //var $lastSongNumCell = $('.song-item-number[data-song-number="' + lastSongNum + '"]');
    var $previousSongNumCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumCell = getSongNumberCell(lastSongNum);
    
    $previousSongNumCell.html(pauseButtonTemplate);
    $lastSongNumCell.html(lastSongNum);
};

var setSong = function(songNumber) {
    currentlyPlayingSongNumber = songNumber;
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
};

var getSongNumberCell = function(number) {
    return $('.song-item-number[data-song-number="' + number + '"]');

};

var updatePlayerBarSong = function() {
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);
};

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
});

