export default function calculateCement({ personHeight, personWidth, drumHeight, drumDiameter, personCount }) {
  const personVolume = Math.PI * (personWidth / 2) ** 2 * personHeight;
  const drumVolume = Math.PI * (drumDiameter / 2) ** 2 * drumHeight;

  const totalPeopleVolume = personVolume * personCount;

  if (personHeight > drumHeight || personWidth > drumDiameter) {
    return { message: "Person does not fit in the drum.", percentFilled: 0, actualCount: 0, cementVolume: 0 };
  }

  if (totalPeopleVolume >= drumVolume) {
    return { 
      message: "Too many people! Drum overfilled.", 
      percentFilled: (totalPeopleVolume / drumVolume) * 100, 
      actualCount: Math.floor(drumVolume / personVolume),
      cementVolume: 0
    };
  }

  const cementVolume = drumVolume - totalPeopleVolume;
  const percentFilled = Math.min((totalPeopleVolume / drumVolume) * 100, 100);

  return {
    message: `Cement needed: ${(cementVolume / 1000).toFixed(2)} liters (with ${personCount} person(s) inside).`,
    percentFilled,
    actualCount: personCount,
    cementVolume
  };
}
