Feature: Video Management
    Scenario: User can view all videos
        Given I am logged in as a user
        When I view the video management page
        Then I should see the video list with 50 videos

    Scenario: User can see the video information
        Given I am logged in as a user
        When I view the video management page
        Then I should see the video information including title, description, status, upload date and tag

    Scenario: User can edit the video information
        Given I am logged in as a user
        When I view the video management page
        When I click on the edit button of a video
        Then I should see the edit video modal
        When I edit the video information
        Then I should see the updated video information in the video list

    Scenario: User can delete the video
        Given I am logged in as a user
        When I view the video management page
        When I click on the delete button of a video
        Then I should see the delete video modal
        When I confirm the deletion
        Then I should see the video list without the deleted video

    Scenario: User should see empty video list when there is no video
        Given I am logged in as a user
        When I view the video management page
        Then I should see an empty data icon with a message "No data found"

    Scenario: User can see the video list with infinite scroll
        Given I am logged in as a user
        When I view the video management page
        Then I should see the video list with infinite scroll





