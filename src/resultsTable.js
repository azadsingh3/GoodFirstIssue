import React from "react";
import "./resultsTable.css";
import { RepoRow } from "./repoRow";
import { IssueRow } from "./issueRow";
import { sortReposByIssueCount, sortReposByStars } from "./load";

export default class ResultsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sortBy: "issues",
      expandedRows: Array(props.repositories.length).fill(false) // TODO: test this
    };
  }

  render() {
    const { repositories } = this.props;
    const { sortBy, expandedRows } = this.state;

    let repos;
    switch (
      sortBy //TODO: if you set the sortBy state, the expansion state of the repo is off
    ) {
      case "issues":
        repos = sortReposByIssueCount(repositories);
        break;
      case "stars":
        repos = sortReposByStars(repositories);
        break;
      default:
        throw Error("invalid sort parameter");
    }

    const setSortBy = sortBy => {
      if (sortBy != this.state.sortBy) {
        const expandedRows = Array(this.props.repositories.length).fill(false);
        this.setState({ sortBy, expandedRows });
      }
    };
    const setExpanded = i => {
      const expandedRows = this.state.expandedRows.slice();
      expandedRows[i] = !expandedRows[i];
      this.setState({ expandedRows });
    };

    function renderHeader() {
      function header() {
        return (
          <thead>
            <tr>
              <th className="leftAlign">Repository</th>
              <th
                className="rightAlign hightlightHover"
                onClick={() => setSortBy("issues")}
              >
                Good First Issues
              </th>
              <th
                className="rightAlign hightlightHover"
                onClick={() => setSortBy("stars")}
              >
                Stars
              </th>
              <th className="rightAlign">Last Updated</th>
            </tr>
          </thead>
        );
      }
      return repos.length > 0 ? header() : <div />;
    }

    function renderTableRows() {
      return (
        <React.Fragment>
          {repos.map((repo, i) => (
            <RepoRow
              repo={repo}
              expanded={expandedRows[i]}
              setExpanded={() => setExpanded(i)}
            >
              {repo.issues.map(issue => {
                return (
                  <IssueRow issue={issue} width={returnWidth(repo.issues[0])} />
                );
              })}
            </RepoRow>
          ))}
        </React.Fragment>
      );
    }
    //TODO: Show table headers when loading
    return (
      <table style={{ width: "100%" }}>
        {renderHeader()}
        <tbody>{renderTableRows()}</tbody>
      </table>
    );
  }
}

function returnWidth(issue) {
  const n = issue.number;
  if (n >= 10000) {
    return 70;
  } else if (n >= 1000) {
    return 60;
  } else if (issue.number >= 100) {
    return 50;
  } else {
    return 40;
  }
}
