const columns = document.querySelector('#ghx-pool-column');
const config = { attributes: true, childList: true, subtree: true };

const callback = function(mutationsList, observer) {
  document.querySelectorAll('.ghx-column-headers > li.ghx-column').forEach((column, columnIndex) => {    
    let storyPoints = 0;
    let remainingStoryPoints = 0;

    const updateSPs = (type, sps) => {
      if (type === 'original') {
        storyPoints += sps;
      }

      if (type === 'remaining') {
        remainingStoryPoints += sps;
      }
    }

    const addSPs = (time, type) => {
      const timeGroups = /((?<weeks>[0-9]+)\sweeks?)?(, )?((?<days>[0-9]+)\sdays?)?(, )?((?<hours>[0-9]+)\shours?)?(, )?((?<minutes>[0-9]+)\sminutes?)?/.exec(time).groups;

      if (timeGroups.weeks) {
        const weeks = Number(timeGroups.weeks) * 7 * 8;
        updateSPs(type, weeks);
      }

      if (timeGroups.days) {
        const days = Number(timeGroups.days) * 8;
        updateSPs(type, days);
      }

      if (timeGroups.hours) {
        const hours = Number(timeGroups.hours);
        updateSPs(type, hours);
      }

      if (timeGroups.minutes) {
        const minutes = Number(timeGroups.minutes) / 60;
        updateSPs(type, minutes);
      }
    }

    document.querySelectorAll('.ghx-swimlane').forEach(swimlane => {
      const swimlaneElement = swimlane && swimlane.querySelectorAll('.ghx-column.ui-sortable')[columnIndex];

      swimlaneElement && swimlaneElement.querySelectorAll('.js-detailview').forEach((task) => {
        task &&
        !task.querySelector('.ghx-type[title=Story]') &&
        !task.querySelector('.ghx-type[title=Bug]') &&
        task.querySelectorAll('.ghx-extra-field-row').forEach((rowElement, index) => {
          const remainingTime = rowElement.querySelector('.ghx-extra-field[data-tooltip^="Σ Remaining Estimate"]');
          const originalTime = rowElement.querySelector('.ghx-extra-field[data-tooltip^="Σ Original Estimate"]');

          if (remainingTime) {
            addSPs(remainingTime.textContent, 'remaining');
          }

          if (originalTime) {
            addSPs(originalTime.textContent, 'original');
          }
        });
      });
    });

    let storyPointsContainer = document.querySelector(`#story-points-container-${columnIndex}`);
    let remainingStoryPointsContainer = document.querySelector(`#remaining-story-points-container-${columnIndex}`);

    if (!storyPointsContainer) {
      storyPointsContainer = document.createElement('div');
      storyPointsContainer.id = `story-points-container-${columnIndex}`;
      column.appendChild(storyPointsContainer);
    }

    if (!remainingStoryPointsContainer) {
      remainingStoryPointsContainer = document.createElement('div');
      remainingStoryPointsContainer.id = `remaining-story-points-container-${columnIndex}`;
      column.appendChild(remainingStoryPointsContainer);
    }

    storyPointsContainer.textContent = `Story points: ${storyPoints.toFixed(2)}`;
    remainingStoryPointsContainer.textContent = `RM story points: ${remainingStoryPoints.toFixed(2)}`;

    document.querySelector('#ghx-pool').style.paddingTop = `${document.querySelector('.ghx-column-headers').clientHeight}px`;
  });
};

if (columns) {
  callback();
  const observer = new MutationObserver(callback);
  observer.observe(columns, config);
}