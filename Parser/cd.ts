export const Projects = {
  Ogswap: 'ogswap',
  Updates: 'updates',
};

type ChangeDirectoryResult = {
  newDirectory: string | null;
  message: string;
};

export function cd(project): ChangeDirectoryResult {
  switch (project) {
    case Projects.Updates:
      return {
        newDirectory: Projects.Updates,
        message: 'Succefully switched to ' + Projects.Updates,
      };
    case Projects.Ogswap:
      // CurrentDirectory = Projects.ogswap;
      // print([textLine({words:[textWord({ characters: "Succefully switched to " + Projects.ogswap })]})]);
      return {
        newDirectory: null,
        message: 'Project is coming soon ',
      };
    default:
      return {
        newDirectory: null,
        message: 'There is no project with this name ',
      };
  }
}
