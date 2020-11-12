import roomsjson from '../../../stubs/rooms';

export default class PopulateTarget {
  constructor() {
    let params = window.location.href.split("?")[1];
    console.log(params);

    let roomNumber = params.split("=")[1];
    console.log(roomNumber);

    let rooms = roomsjson.rooms;
    for (let i = 0; i < rooms.length; i++) {
      if (rooms[i].id == roomNumber) {
        this.roomTarget = rooms[i];
      }
    }
  }

  populate() {
    if (this.roomTarget) {
      switch (this.roomTarget.page_type) {
        case 'photo_360':
          document.getElementsByClassName("title")[0].innerHTML = this.roomTarget.page_title
          document.getElementsByClassName("story-title")[0].innerHTML = this.roomTarget.story_title
          document.getElementsByClassName("scrollable-story")[0].innerHTML += this.roomTarget.story_content
          console.log(this.roomTarget.hotspots)
          pannellum.viewer('panorama', {
            "type": "equirectangular",
            "panorama": this.roomTarget.image_1,
            "autoLoad": true,
            "hotSpotDebug": this.roomTarget.find_hotspots,
            "hotSpots": this.roomTarget.hotspots
          })
          break
        case 'two_photo':
          console.log("hi")
          document.getElementsByClassName("title")[0].innerHTML = this.roomTarget.page_title
          document.getElementsByClassName("story-title")[0].innerHTML = this.roomTarget.story_title
          document.getElementsByClassName("scrollable-story")[0].innerHTML += this.roomTarget.story_content
          document.getElementById("image_1").src = this.roomTarget.image_1 //this needs to change
          document.getElementById("image_2").src = this.roomTarget.image_2 // this too, add the "/assets/images/"
          break
      }
    }
  }

}

function populate(json) {

  switch (json.page_type) {
    case 'photo_360':
      document.getElementsByClassName("title")[0].innerHTML = json.page_title
      document.getElementsByClassName("story-title")[0].innerHTML = json.story_title
      document.getElementsByClassName("scrollable-story")[0].innerHTML += json.story_content
      console.log(json.hotspots)
      pannellum.viewer('panorama', {
        "type": "equirectangular",
        "panorama": json.image_1,
        "autoLoad": true,
        "hotSpotDebug": json.find_hotspots,
        "hotSpots": json.hotspots
      })
      break
    case 'two_photo':
      console.log("hi")
      document.getElementsByClassName("title")[0].innerHTML = json.page_title
      document.getElementsByClassName("story-title")[0].innerHTML = json.story_title
      document.getElementsByClassName("scrollable-story")[0].innerHTML += json.story_content
      document.getElementById("image_1").src = json.image_1 //this needs to change
      document.getElementById("image_2").src = json.image_2 // this too, add the "/assets/images/"
      break
  }
}

