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
        var songNumber = parseInt($(this).attr('data-song-number'));
        
        if (currentlyPlayingSongNumber !== null) {
            var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
            currentlyPlayingCell.html(currentlyPlayingSongNumber);
        }
        if (currentlyPlayingSongNumber !== songNumber) {
            setSong(songNumber);
            currentSoundFile.play();
            $(this).html(pauseButtonTemplate);
            currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
            updatePlayerBarSong();
        } else if (currentlyPlayingSongNumber === songNumber) {
            if (currentSoundFile.isPaused()) {
                $(this).html(pauseButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPauseButton);
                currentSoundFile.play();
            } else {
                $(this).html(playButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPlayButton);
                currentSoundFile.pause();   
            }
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
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));
        
        if(songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(songNumber);
        }
    };
    $row.find('.song-item-number').click(clickHandler);
    $row.hover(onHover, offHover);
    return $row;
};

var togglePlayFromPlayerBar = function() {
    var $songNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    
    if (currentSoundFile.isPaused()) {
        mainControlsPlayPause.html(playerBarPauseButton);
        $songNumberCell.html(pauseButtonTemplate);
        currentSoundFile.play();
    } else {
        mainControlsPlayPause.html(playerBarPlayButton);
        $songNumberCell.html(playButtonTemplate);
        currentSoundFile.pause();
    }
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
    currentSoundFile.play();
    updatePlayerBarSong();
    
    var lastSongNum = lastSongIndex(currSongIndex);
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
    currentSoundFile.play();
    updatePlayerBarSong();
    
    var lastSongNum = getLastSongNum(currSongIndex);
    var $previousSongNumCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumCell = getSongNumberCell(lastSongNum);
    
    $previousSongNumCell.html(pauseButtonTemplate);
    $lastSongNumCell.html(lastSongNum);
};

var setSong = function(songNumber) {
    if (currentSoundFile) {
        currentSoundFile.stop();
    }
    
    currentlyPlayingSongNumber = songNumber;
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
         formats: [ 'mp3' ],
         preload: true
     });
    
    setVolume(currentVolume);
};

var setVolume = function(volume) {
    if (currentSoundFile) {
        currentSoundFile.setVolume(volume);
    }  
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
var currentSoundFile = null;
var currentVolume = 80;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

var mainControlsPlayPause = $('.main-controls .play-pause');

$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
    mainControlsPlayPause.click(togglePlayFromPlayerBar);
});

