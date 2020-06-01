class FoldersController < ApplicationController

  before_action :api_client

  def index
    render json: @api.folders, status: :ok
  end

  def show
    render json: @api.folder(params[:id]), status: :ok
  end

  def create
  end

  def update
  end

  def delete
  end

  private

  def api_client
    @api = ApiClient.new(current_user)
  end
end
