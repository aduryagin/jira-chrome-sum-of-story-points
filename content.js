const columns = document.querySelector('#ghx-pool-column');
const config = { attributes: true, childList: true, subtree: true };

const callback = function(mutationsList, observer) {
  document.querySelectorAll('.ghx-column-headers > li.ghx-column').forEach((column, columnIndex) => {    
    let storyPoints = 0;

    document.querySelectorAll('.ghx-swimlane').forEach(swimlane => {
      const swimlaneElement = swimlane && swimlane.querySelectorAll('.ghx-column.ui-sortable')[columnIndex];
      swimlaneElement && swimlaneElement.querySelectorAll('.ghx-extra-field-content').forEach(story => {
        const time = story.textContent;
        
        const timeGroups = /((?<weeks>[0-9]+)\sweeks?)?(, )?((?<days>[0-9]+)\sdays?)?(, )?((?<hours>[0-9]+)\shours?)?(, )?((?<minutes>[0-9]+)\sminutes?)?/.exec(time).groups;
      
        if (timeGroups.weeks) {
          storyPoints += Number(timeGroups.weeks) * 7 * 8;
        }

        if (timeGroups.days) {
          storyPoints += Number(timeGroups.days) * 8;
        }
        
        if (timeGroups.hours) {
          storyPoints += Number(timeGroups.hours);
        }
        
        if (timeGroups.minutes) {
          storyPoints += Number(timeGroups.minutes) / 60;
        }
      });
    });

    let storyPointsContainer = document.querySelector(`#story-points-container-${columnIndex}`);
    
    if (!storyPointsContainer) {
      storyPointsContainer = document.createElement('div');
      storyPointsContainer.id = `story-points-container-${columnIndex}`;
      column.appendChild(storyPointsContainer);
    }

    storyPointsContainer.textContent = `Story points: ${storyPoints.toFixed(2)}`;
  });
};

callback();
const observer = new MutationObserver(callback);
observer.observe(columns, config);